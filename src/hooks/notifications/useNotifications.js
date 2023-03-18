import { useConfig } from '../../context/core';

const useNotifications = () => {
    const { firebaseServerKey } = useConfig();
    const sendNotification = async (registrationIds, title, body, data) => {
        try {
            const message = {
                registration_ids: registrationIds,
                notification: {
                    title,
                    body,
                    sound: 'default',
                    priority: 'high',
                    vibrate: 1,
                    contentAvailable: true,
                    foreground: true,
                    volume: 1,
                },
                data,
            };
            const headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: `key=${firebaseServerKey}`,
            });

            const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers,
                body: JSON.stringify(message),
            });

            await response.json();
        } catch (error) {
            console.log('error', error);
        }
    };

    return {
        sendNotification,
    };
};

export default useNotifications;
