/* eslint-disable no-await-in-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
// features/instagram-ingest.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { decrypt } = require('../lib/kms');
const { graphRequest } = require('../lib/graph');
const { extractHashtags } = require('../lib/text');
const { mean, median } = require('../lib/stats');
const { buildRecommendationFromGap } = require('../lib/rec-engine');

const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;
const GAP_THRESHOLD = 0.15;
const INSIGHTS_PARALLEL = 5;

/**
 * Discover IG Business account via linked Facebook Pages.
 */
async function discoverInstagramAccount(longToken) {
    const resp = await graphRequest(
        '/me/accounts?fields=id,access_token,instagram_business_account',
        longToken,
    );
    return resp.data.find((p) => p.instagram_business_account) || null;
}

/**
 * Fetch IG Profile (followers_count, username).
 */
async function fetchProfile(igBusinessId, pageToken) {
    return graphRequest(
        `/${igBusinessId}?fields=followers_count,username`,
        pageToken,
    );
}

/**
 * Paginate through IG media to collect up to `limit` items.
 * We disable the no-await-in-loop rule because pages depend on previous cursor.
 */
/* eslint-disable no-await-in-loop */
async function fetchRecentMedia(igBusinessId, pageToken, limit = 90) {
    let media = [];
    let next = `/${igBusinessId}/media?fields=id,caption,media_type,permalink,timestamp&limit=50`;

    while (next && media.length < limit) {
        const resp = await graphRequest(next, pageToken);
        media = media.concat(resp.data);
        next = resp.paging?.next
            ? resp.paging.next.replace('https://graph.facebook.com/v19.0', '')
            : null;
    }

    return media.slice(0, limit);
}
/* eslint-enable no-await-in-loop */

/**
 * Fetch insights for a single media ID.
 */
async function fetchMediaInsights(mediaId, pageToken) {
    const resp = await graphRequest(
        `/${mediaId}/insights?metric=impressions,reach,likes,comments,saved`,
        pageToken,
    );
    return Object.fromEntries(resp.data.map((m) => [m.name, m.values[0].value]));
}

/**
 * Write skeleton post docs and return array of { mediaId, docRef }.
 */
async function writePostSkeletons(db, uid, mediaItems) {
    const entries = mediaItems.map((item) => {
        const ref = db.collection('posts').doc();
        const caption = item.caption || '';
        const skeleton = {
            uid,
            platform: 'instagram',
            igMediaId: item.id,
            postedAt: admin.firestore.Timestamp.fromDate(new Date(item.timestamp)),
            caption,
            hashtags: extractHashtags(caption),
            mediaType: item.media_type,
            permalink: item.permalink,
            impressions: null,
            reach: null,
            likes: null,
            comments: null,
            saved: null,
            engagementRate: 0,
            viewFollowerRatio: 0,
            captionLength: caption.length,
            hourBucket: new Date(item.timestamp).getHours(),
            fetchedAt: admin.firestore.Timestamp.now(),
        };
        return { mediaId: item.id, docRef: ref, skeleton };
    });

    const batch = db.batch();
    entries.forEach(({ docRef, skeleton }) => batch.set(docRef, skeleton));
    await batch.commit();

    return entries;
}

/**
 * Compute weekly snapshot, identify gaps, and generate recommendations.
 */
async function computeAnalytics(uid, db) {
    const since = new Date(Date.now() - FOUR_WEEKS_MS);

    // 1) Load recent posts
    const postsSnap = await db.collection('posts')
        .where('uid', '==', uid)
        .where('postedAt', '>=', since)
        .get();
    const posts = postsSnap.docs.map((d) => d.data());
    if (!posts.length) return;

    // 2) Fetch followerCount from user record
    // const userSnap = await db.doc(`users/${uid}`).get();
    // const followerCount = userSnap.data()?.ig?.followerCount || 0;

    // 3) Calculate metrics
    const postsPerWeek = posts.length / 4;
    const avgEngagementRate = mean(posts.map((p) => p.engagementRate).filter((x) => x > 0));
    const medianViewFollowerRatio = median(posts.map((p) => p.viewFollowerRatio).filter((x) => x > 0));
    const avgCaptionChars = mean(posts.map((p) => p.captionLength));
    const allHashtags = posts.flatMap((p) => p.hashtags);
    const avgHashtagCount = allHashtags.length / posts.length;
    const hashtagDiversity = allHashtags.length
        ? new Set(allHashtags).size / allHashtags.length
        : 0;

    // 4) Write snapshot
    const snapshotId = `${uid}_${Date.now()}`;
    await db.collection('snapshots').doc(snapshotId).set({
        uid,
        period: 'weekly',
        date: admin.firestore.Timestamp.now(),
        postsCount28d: posts.length,
        postsPerWeek,
        avgEngagementRate,
        medianViewFollowerRatio,
        avgCaptionChars,
        avgHashtagCount,
        hashtagDiversity,
        peakHourUsageRatio: null,
        computedAt: admin.firestore.Timestamp.now(),
    });

    // 5) Load cohort stats (fallback if missing)
    const cohortSnap = await db.doc(`cohorts/${uid}`).get();
    const cohortStats = cohortSnap.exists
        ? cohortSnap.data().stats
        : {
            postsPerWeekP75: 4,
            engagementRateP75: 0.08,
            vfrP75: 0.9,
            hashtagDiversityP75: 0.55,
            captionCharsP75: 150,
            hashtagCountP75: 5,
        };

    // 6) Build gaps
    const gapDefs = [
        { key: 'posts_per_week', val: postsPerWeek, p75: cohortStats.postsPerWeekP75 },
        { key: 'engagement_rate', val: avgEngagementRate, p75: cohortStats.engagementRateP75 },
        { key: 'view_follower_ratio', val: medianViewFollowerRatio, p75: cohortStats.vfrP75 },
        { key: 'hashtag_diversity', val: hashtagDiversity, p75: cohortStats.hashtagDiversityP75 },
        { key: 'avg_caption_chars', val: avgCaptionChars, p75: cohortStats.captionCharsP75 },
        { key: 'avg_hashtag_count', val: avgHashtagCount, p75: cohortStats.hashtagCountP75 },
    ];

    const improvable = gapDefs
        .map(({ key, val, p75 }) => {
            const deltaPct = p75 > 0 ? (p75 - val) / p75 : 0;
            return {
                metricKey: key,
                yourValue: val,
                cohortP75: p75,
                cohortMean: null,
                deltaPct,
                improvable: deltaPct >= GAP_THRESHOLD,
            };
        })
        .filter((g) => g.improvable);

    // 7) Write gaps in batch
    const gapBatch = db.batch();
    improvable.forEach((g) => {
        const ref = db.collection('gaps').doc(`${uid}_${g.metricKey}`);
        gapBatch.set(ref, { uid, ...g, updatedAt: admin.firestore.Timestamp.now() }, { merge: true });
    });
    await gapBatch.commit();

    // 8) Write recommendations in batch
    const recBatch = db.batch();
    improvable.forEach((g) => {
        const rec = buildRecommendationFromGap(g);
        if (!rec) return;
        const ref = db.collection('recommendations').doc(`${uid}_${rec.code}`);
        recBatch.set(ref, {
            uid,
            ...rec,
            status: 'new',
            sourceGapKeys: [g.metricKey],
            createdAt: admin.firestore.Timestamp.now(),
        }, { merge: true });
    });
    await recBatch.commit();
}

/**
 * Main callable function: ingest IG media, fetch insights, run analytics.
 */
exports.ingestInstagramInitial = functions.https.onCall(async (_, context) => {
    const uid = context.auth?.uid;
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Auth required');

    const db = admin.firestore();

    // Decrypt stored IG token
    const tokenSnap = await db.doc(`platform_tokens/${uid}_instagram`).get();
    if (!tokenSnap.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'Instagram not connected');
    }
    const longToken = await decrypt(tokenSnap.data().encryptedAccessToken);

    // Discover IG Business account
    const page = await discoverInstagramAccount(longToken);
    if (!page) {
        throw new functions.https.HttpsError('failed-precondition', 'No IG Business account linked');
    }
    const igBusinessId = page.instagram_business_account.id;
    const pageToken = page.access_token;

    // Fetch profile and update user
    const profile = await fetchProfile(igBusinessId, pageToken);
    const followerCount = profile.followers_count || 0;
    await db.doc(`users/${uid}`).set({
        ig: {
            connectionStatus: 'connected',
            isProfessional: true,
            pageFound: true,
            linkedPage: true,
            hasAdminRole: true,
            permissionsOk: true,
            igBusinessId,
            followerCount,
            lastSyncAt: admin.firestore.Timestamp.now(),
        },
    }, { merge: true });

    // Fetch media, write skeletons, fetch insights in parallel
    const mediaItems = await fetchRecentMedia(igBusinessId, pageToken);
    const postEntries = await writePostSkeletons(db, uid, mediaItems);

    // Build insight tasks
    const insightTasks = postEntries.map(({ mediaId, docRef }) => async () => {
        try {
            const m = await fetchMediaInsights(mediaId, pageToken);
            const likes = m.likes || 0;
            const comments = m.comments || 0;
            const savedCount = m.saved || 0;
            const impressions = m.impressions || m.reach || 0;
            const engagementRate = impressions
                ? (likes + comments + savedCount) / impressions
                : 0;
            const viewFollowerRatio = followerCount
                ? impressions / followerCount
                : 0;

            await docRef.update({
                impressions: m.impressions || null,
                reach: m.reach || null,
                likes,
                comments,
                saved: savedCount,
                engagementRate,
                viewFollowerRatio,
            });
        } catch (err) {
            console.warn(`Insights failed for ${mediaId}:`, err.message);
        }
    });

    // Execute in controlled parallel batches
    for (let i = 0; i < insightTasks.length; i += INSIGHTS_PARALLEL) {
        const batch = insightTasks.slice(i, i + INSIGHTS_PARALLEL).map((fn) => fn());
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(batch);
    }

    // Run analytics
    await computeAnalytics(uid, db);

    return { status: 'ok', importedCount: mediaItems.length };
});
