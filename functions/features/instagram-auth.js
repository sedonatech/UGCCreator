// features/instagram-auth.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const { encrypt } = require('../lib/kms');

const {
    FB_APP_ID,
    FB_APP_SECRET,
    IG_REDIRECT_URI,
    APP_POST_AUTH_REDIRECT,
} = process.env;

exports.exchangeInstagramAuthCode = functions.https.onRequest(async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code || !state) {
            return res.status(400).send('Missing `code` or `state`.');
        }

        // Decode our Firebase UID from state
        const parsedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
        const { uid } = parsedState;
        if (!uid) {
            return res.status(400).send('Invalid state payload.');
        }

        // 1) Short‑lived token endpoint
        const shortUrl = `
      https://graph.facebook.com/v19.0/oauth/access_token
      ?client_id=${FB_APP_ID}
      &client_secret=${FB_APP_SECRET}
      &redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}
      &code=${encodeURIComponent(code)}
    `.replace(/\s+/g, '');

        const shortResp = await fetch(shortUrl);
        const shortData = await shortResp.json();
        if (!shortResp.ok || shortData.error) {
            throw new Error(shortData.error?.message || 'Failed to fetch short-lived token.');
        }

        // 2) Long‑lived token exchange
        const longUrl = `
      https://graph.facebook.com/v19.0/oauth/access_token
      ?grant_type=fb_exchange_token
      &client_id=${FB_APP_ID}
      &client_secret=${FB_APP_SECRET}
      &fb_exchange_token=${encodeURIComponent(shortData.access_token)}
    `.replace(/\s+/g, '');

        const longResp = await fetch(longUrl);
        const longData = await longResp.json();
        if (!longResp.ok || longData.error) {
            throw new Error(longData.error?.message || 'Failed to fetch long-lived token.');
        }

        // 3) Encrypt & Persist
        const encryptedToken = await encrypt(longData.access_token);
        await admin.firestore().doc(`platform_tokens/${uid}_instagram`).set({
            uid,
            platform: 'instagram',
            encryptedAccessToken: encryptedToken,
            expiresAt: Date.now() + (longData.expires_in * 1000),
        }, { merge: true });

        // 4) Initialize user.ig state
        await admin.firestore().doc(`users/${uid}`).set({
            ig: {
                connectionStatus: 'incomplete',
                permissionsOk: true,
            },
        }, { merge: true });

        // 5) Redirect back to the app
        return res.redirect(`${APP_POST_AUTH_REDIRECT}?platform=instagram&status=ok`);
    } catch (error) {
        console.error('exchangeInstagramAuthCode error:', error);
        return res.redirect(`${APP_POST_AUTH_REDIRECT}?platform=instagram&status=error`);
    }
});
