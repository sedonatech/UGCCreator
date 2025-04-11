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
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
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
