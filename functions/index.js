/* eslint-disable @typescript-eslint/naming-convention */
const functions = require('firebase-functions');
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

admin.initializeApp();

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

        const {
            token, title, body, data,
        } = req.body;

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

        const fcmRes = await fetch(
            'https://fcm.googleapis.com/v1/projects/ugccreatorapp/messages:send',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            },
        );

        const result = await fcmRes.json();
        return res.status(200).json(result);
    } catch (err) {
        console.error('Error sending push notification:', err);
        return res.status(500).json({ error: err.message });
    }
});

// Analytics Copilot additions:
// ⚠️ Paste your credentials directly here for now; replace with .env later
const IG_APP_ID = '306174533646079';
const IG_APP_SECRET = '060a21a0bd70d39dd4cc3c57f1e3a1f3';
// Example redirect: https://us-central1-your-project.cloudfunctions.net/facebookAuthCallback
const IG_OAUTH_REDIRECT = 'https://us-central1-ugccreatorapp.cloudfunctions.net/facebookAuthCallback';
// Local LLM server configuration
const LLM_API_URL = 'http://localhost:8000/v1/chat/completions';

/**
 * Redirects user to Facebook's OAuth dialog to grant Instagram permissions
 */
exports.facebookAuthRedirect = functions.https.onRequest((req, res) => {
    const scope = encodeURIComponent('instagram_basic,instagram_insights');
    const oauthUrl = 'https://www.facebook.com/v16.0/dialog/oauth'
    + `?client_id=${IG_APP_ID}`
    + `&redirect_uri=${encodeURIComponent(IG_OAUTH_REDIRECT)}`
    + `&scope=${scope}`
    + '&response_type=code'
    + `&state=${req.query.uid}`; // pass Firebase UID via state
    res.redirect(oauthUrl);
});

/**
 * Handles the OAuth callback, exchanges code for tokens, and stores credentials
 */
exports.facebookAuthCallback = functions.https.onRequest(async (req, res) => {
    try {
        const { code } = req.query;
        const uid = req.query.state; // Firebase user ID

        // Exchange code for short-lived token
        const tokenResp = await fetch(
            'https://graph.facebook.com/v16.0/oauth/access_token'
      + `?client_id=${IG_APP_ID}`
      + `&redirect_uri=${encodeURIComponent(IG_OAUTH_REDIRECT)}`
      + `&client_secret=${IG_APP_SECRET}`
      + `&code=${code}`,
        );
        const { access_token: shortLivedToken } = await tokenResp.json();

        // Exchange short-lived for long-lived token + get IG user ID
        const longResp = await fetch(
            'https://graph.facebook.com/v16.0/access_token'
      + '?grant_type=fb_exchange_token'
      + `&client_id=${IG_APP_ID}`
      + `&client_secret=${IG_APP_SECRET}`
      + `&fb_exchange_token=${shortLivedToken}`,
        );
        const {
            access_token: longLivedToken,
            expires_in,
            user_id: igUserId,
        } = await longResp.json();

        // Persist credentials to Firestore
        await admin.firestore().collection('users').doc(uid).set({
            igUserId,
            accessToken: longLivedToken,
            tokenExpires: Date.now() + expires_in * 1000,
        }, { merge: true });

        // Redirect back to your app's success page
        res.redirect(`${IG_OAUTH_REDIRECT}/success`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed');
    }
});

/**
 * Fetch Instagram metrics for the past week
 */
async function fetchInstagramMetrics(userId, accessToken) {
    const since = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    const url = `https://graph.facebook.com/v16.0/${userId}/insights`
    + `?metric=impressions,reach,profile_views&period=day&since=${since}`;
    const res = await fetch(`${url}&access_token=${accessToken}`);
    const { data } = await res.json();
    return data;
}

/**
 * Callable function: compares user metrics to benchmarks and returns AI insights
 */
exports.analyticsCopilot = functions.https.onCall(async (data, context) => {
    const { igUserId, accessToken } = data;

    // 1) Pull metrics
    const metrics = await fetchInstagramMetrics(igUserId, accessToken);

    // 2) Load benchmark data
    const benchSnap = await admin.firestore().collection('benchmarks').doc('instagram_top').get();
    const benchmarks = benchSnap.exists ? benchSnap.data() : {};

    // 3) Build AI prompt
    const prompt = `You are an expert social media analyst. Here are my Instagram metrics for the last 7 days:\n${
        metrics.map((m) => `- ${m.name}: ${m.values.map((v) => v.value).join(', ')}`).join('\n')
    }\n\nBenchmark averages for top creators:\n${
        Object.entries(benchmarks).map(([k, v]) => `- ${k}: ${v}`).join('\n')
    }\n\nPlease compare, highlight strengths/weaknesses, and give top 3 prioritized recommendations.`;

    // 4) Generate insights via local LLM
    const llmResp = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful social media analyst.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        }),
    });
    const llmData = await llmResp.json();
    const insights = llmData.choices[0].message.content;

    // 5) Persist insights and return
    await admin.firestore().collection('users')
        .doc(context.auth.uid)
        .collection('analytics')
        .add({ metrics, insights, timestamp: admin.firestore.FieldValue.serverTimestamp() });

    return { insights };
});
