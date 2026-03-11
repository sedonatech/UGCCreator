const functions = require('firebase-functions');
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const FCM_ENDPOINT = 'https://fcm.googleapis.com/v1/projects/ugccreatorapp/messages:send';
const BATCH_SIZE = 50;

async function getAccessToken() {
    const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
}

async function sendFCMToToken(accessToken, token, title, body, data = {}) {
    const message = {
        message: {
            token,
            notification: { title, body },
            android: { priority: 'high' },
            data,
        },
    };

    const fcmRes = await fetch(FCM_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    const result = await fcmRes.json();

    if (!fcmRes.ok) {
        const errorCode = result?.error?.details?.[0]?.errorCode || result?.error?.status || '';
        functions.logger.warn('FCM send failed:', {
            token: token.substring(0, 10) + '...',
            httpStatus: fcmRes.status,
            errorCode,
            error: result?.error?.message || result?.error,
        });
        return { success: false, token, errorCode };
    }

    return { success: true, token };
}

async function sendBatchNotifications(creators, messageFn, data = {}) {
    functions.logger.info(`Starting batch send to ${creators.length} creators`);
    const accessToken = await getAccessToken();
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < creators.length; i += BATCH_SIZE) {
        const batch = creators.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
            batch.map(({ fcmToken, userName }) => {
                const { title, body } = messageFn(userName);
                return sendFCMToToken(accessToken, fcmToken, title, body, data);
            }),
        );

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.success) {
                sent++;
            } else {
                failed++;
                const errorCode = result.status === 'fulfilled' ? result.value.errorCode : '';
                const failedToken = result.status === 'fulfilled' ? result.value.token : '';

                if (result.status === 'rejected') {
                    functions.logger.error('FCM send rejected:', result.reason?.message || result.reason);
                } else if (errorCode && errorCode !== 'UNREGISTERED' && errorCode !== 'NOT_FOUND') {
                    functions.logger.warn('FCM non-token error:', { errorCode });
                }

                if (errorCode === 'UNREGISTERED' || errorCode === 'NOT_FOUND') {
                    try {
                        const userSnap = await admin
                            .firestore()
                            .collection('users')
                            .where('fcmToken', '==', failedToken)
                            .limit(1)
                            .get();
                        if (!userSnap.empty) {
                            await userSnap.docs[0].ref.update({ fcmToken: admin.firestore.FieldValue.delete() });
                            functions.logger.info(`Cleared stale FCM token for user ${userSnap.docs[0].id}`);
                        }
                    } catch (cleanupErr) {
                        functions.logger.warn('Failed to clean stale token:', cleanupErr.message);
                    }
                }
            }
        }
    }

    functions.logger.info(`Batch send complete: ${sent} sent, ${failed} failed out of ${creators.length}`);
    return { sent, failed };
}

async function getCreatorsWithTokens() {
    const snapshot = await admin
        .firestore()
        .collection('users')
        .where('type', '==', 'creator')
        .select('fcmToken', 'userName')
        .get();

    return snapshot.docs
        .map(doc => ({ id: doc.id, fcmToken: doc.data().fcmToken, userName: doc.data().userName }))
        .filter(user => user.fcmToken);
}

function pickRandom(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

module.exports = {
    sendBatchNotifications,
    getCreatorsWithTokens,
    pickRandom,
};
