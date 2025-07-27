const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const { encrypt } = require('../lib/kms');

const { FB_APP_ID } = process.env;
const { FB_APP_SECRET } = process.env;
const { IG_REDIRECT_URI } = process.env;

/**
 * Exchange Facebook auth code for long-lived token; initialize IG connection status.
 */
exports.exchangeInstagramAuthCode = functions.https.onRequest(async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code || !state) return res.status(400).send('Missing code/state');

        const { uid } = JSON.parse(Buffer.from(state, 'base64').toString());

        // Short-lived token
        const shortUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}&code=${code}`;
        const shortData = await fetch(shortUrl).then((r) => r.json());
        if (shortData.error) throw new Error(shortData.error.message);

        // Long-lived token
        const longUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${shortData.access_token}`;
        const longData = await fetch(longUrl).then((r) => r.json());
        if (longData.error) throw new Error(longData.error.message);

        await admin.firestore().doc(`platform_tokens/${uid}_instagram`).set({
            uid,
            platform: 'instagram',
            encryptedAccessToken: await encrypt(longData.access_token),
            expiresAt: Date.now() + (longData.expires_in * 1000),
        }, { merge: true });

        await admin.firestore().doc(`users/${uid}`).set({
            ig: { connectionStatus: 'incomplete', permissionsOk: true },
        }, { merge: true });

        return res.redirect(`${process.env.APP_POST_AUTH_REDIRECT}?platform=instagram&status=ok`);
    } catch (err) {
        console.error('exchangeInstagramAuthCode error:', err);
        return res.redirect(`${process.env.APP_POST_AUTH_REDIRECT}?platform=instagram&status=error`);
    }
});
