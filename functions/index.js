const functions = require('firebase-functions');
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

admin.initializeApp();

// ─── Existing HTTP endpoints ─────────────────────────────────────────────────

exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        try {
            await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized: Invalid ID token' });
        }

        const { token, title, body, data } = req.body;

        if (!token || !title || !body) {
            return res.status(400).json({ error: 'Missing required fields (token, title, body)' });
        }

        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        const message = {
            message: {
                token,
                notification: {
                    title,
                    body,
                },
                android: {
                    priority: 'high',
                },
                data: data || {},
            },
        };

        const fcmRes = await fetch('https://fcm.googleapis.com/v1/projects/ugccreatorapp/messages:send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await fcmRes.json();
        return res.status(200).json(result);
    } catch (err) {
        console.error('Error sending push notification:', err);
        return res.status(500).json({ error: err.message });
    }
});

// FREE: User Generated Content Brand Deals via Remotive (no key needed)
// Method: GET
// Query params:
//   - keywords: comma-separated list (optional)
//   - page: positive integer (default 1) — forwarded to client only, Remotive handles its own paging

exports.userGeneratedContentBrandDealsSearch = functions.https.onRequest(async (request, response) => {
    try {
        if (request.method === 'OPTIONS') {
            response.set('Access-Control-Allow-Origin', '*');
            response.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            response.set('Access-Control-Allow-Headers', 'Content-Type');
            return response.status(204).send('');
        }
        if (request.method !== 'GET') {
            return response.status(405).json({ error: 'Only GET is allowed' });
        }

        const defaultKeywords = [
            'user generated content',
            'user-generated content',
            'UGC',
            'TikTok',
            'Reels',
            'creator',
            'influencer',
            'influencer marketing',
            'social media',
            'short-form video',
            'content creator',
            'brand collaboration',
        ];

        const keywordsParameter = typeof request.query.keywords === 'string' ? request.query.keywords : '';
        const providedKeywords = keywordsParameter
            ? keywordsParameter
                  .split(',')
                  .map(value => value.trim())
                  .filter(Boolean)
            : [];

        const allKeywordsList = [...defaultKeywords, ...providedKeywords];
        const searchQuery = Array.from(new Set(allKeywordsList)).join(' '); // Remotive uses simple full-text search

        // Remotive public API: https://remotive.com/api/remote-jobs?search=<query>
        const remotiveRequestAddress = new URL('https://remotive.com/api/remote-jobs');
        remotiveRequestAddress.searchParams.set('search', searchQuery);

        const upstreamResponse = await fetch(remotiveRequestAddress.toString(), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });

        if (!upstreamResponse.ok) {
            const upstreamText = await upstreamResponse.text();
            return response.status(upstreamResponse.status).json({ error: 'Upstream error', details: upstreamText });
        }

        const upstreamResponseBody = await upstreamResponse.json();
        const rawJobList = Array.isArray(upstreamResponseBody && upstreamResponseBody.jobs)
            ? upstreamResponseBody.jobs
            : [];

        // Normalize to your lead shape
        const normalizedLeadList = rawJobList
            // keep only obviously relevant postings
            .filter(job => {
                const combinedTextLowercased = `${job.title ?? ''} ${job.description ?? ''}`.toLowerCase();
                return (
                    combinedTextLowercased.includes('ugc') ||
                    combinedTextLowercased.includes('user generated content') ||
                    combinedTextLowercased.includes('tiktok') ||
                    combinedTextLowercased.includes('reels') ||
                    combinedTextLowercased.includes('creator') ||
                    combinedTextLowercased.includes('influencer') ||
                    combinedTextLowercased.includes('social media')
                );
            })
            .map(job => {
                const combinedTextLowercased = `${job.title ?? ''} ${job.description ?? ''}`.toLowerCase();

                let platformHint = 'General';
                if (combinedTextLowercased.includes('tiktok')) platformHint = 'TikTok';
                else if (combinedTextLowercased.includes('instagram') || combinedTextLowercased.includes('reels'))
                    platformHint = 'Instagram';
                else if (combinedTextLowercased.includes('youtube') || combinedTextLowercased.includes('shorts'))
                    platformHint = 'YouTube';

                return {
                    identifier: String(job.id ?? job.url),
                    brandName: job.company_name ?? 'Unknown',
                    roleTitle: job.title ?? 'Untitled',
                    applicationLink: String(job.url),
                    postedAtCoordinatedUniversalTime: job.publication_date,
                    locationDisplay: job.candidate_required_location || undefined,
                    platformHint,
                };
            });

        // Basic de-duplication by identifier
        const uniqueLeadList = Array.from(new Map(normalizedLeadList.map(lead => [lead.identifier, lead])).values());

        response.set('Access-Control-Allow-Origin', '*');
        response.set('Cache-Control', 'public, max-age=120, s-maxage=300');
        return response.status(200).json({
            provider: 'remotive',
            queryUsed: searchQuery,
            pageNumber: Number.parseInt(request.query.page, 10) > 0 ? Number.parseInt(request.query.page, 10) : 1,
            leads: uniqueLeadList,
        });
    } catch (error) {
        console.error('freeUserGeneratedContentBrandDealsSearch error:', error);
        return response.status(500).json({ error: error.message || 'Internal error' });
    }
});

// ─── Debug: Test Notification Endpoint ───────────────────────────────────────
// Call: https://us-central1-ugccreatorapp.cloudfunctions.net/testNotification
// Remove this after debugging is done.

exports.testNotification = functions.https.onRequest(async (req, res) => {
    try {
        const { getCreatorsWithTokens, sendBatchNotifications } = require('./helpers/fcm');

        const creators = await getCreatorsWithTokens();
        if (creators.length === 0) {
            return res.status(200).json({ error: 'No creators with FCM tokens found', creatorsCount: 0 });
        }

        // Send a test notification to all creators
        const result = await sendBatchNotifications(
            creators,
            userName => ({
                title: `Hey ${userName || 'Creator'}, this is a test!`,
                body: 'If you see this, notifications are working!',
            }),
            { type: 'test' },
        );

        return res.status(200).json({
            creatorsFound: creators.length,
            creatorsSample: creators.slice(0, 3).map(c => ({ id: c.id, userName: c.userName, hasToken: !!c.fcmToken })),
            sent: result.sent,
            failed: result.failed,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// ─── Scheduled Notifications ─────────────────────────────────────────────────

const scheduledNotifications = require('./scheduled/notifications');
exports.scheduledBrandsCatalogueNotification = scheduledNotifications.scheduledBrandsCatalogueNotification;
exports.scheduledBrandsHiringNotification = scheduledNotifications.scheduledBrandsHiringNotification;
exports.scheduledChallengesNotification = scheduledNotifications.scheduledChallengesNotification;
