import { useEffect, useState } from 'react';
import { getMessaging, getInitialNotification } from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { APP_TABS } from '../../navigation/ScreenNames';

const useNotificationInteraction = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const messaging = getMessaging();
        messaging.onNotificationOpenedApp((remoteMessage) => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
            setLoading(false);
            navigation.reset({
                index: 0,
                routes: [{ name: APP_TABS }],
            });
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        // Check whether an initial notification is available
        (async () => {
            setLoading(true);
            const remoteMessage = await getInitialNotification();
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:  ',
                    remoteMessage,
                );
                setLoading(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: APP_TABS }],
                });
            }
        })();
    }, []);

    return {
        loading,
    };
};

export default useNotificationInteraction;
