import auth from '@react-native-firebase/auth';

const useNotifications = () => {
    const sendNotification = async (fcmToken, title, body, data) => {
        try {
            const { currentUser } = auth();
            if (!currentUser) throw new Error('User not logged in');
            const idToken = await currentUser.getIdToken();

            const message = {
                token: fcmToken,
                title: title || '',
                body: body || '',
                data: data || {},
            };

            const response = await fetch('https://sendpushnotification-teghgfnx4a-uc.a.run.app', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            const result = await response.json();
            console.log('Push response:', JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('Push error:', JSON.stringify(error, null, 2));
        }
    };

    return {
        sendNotification,
    };
};

export default useNotifications;
