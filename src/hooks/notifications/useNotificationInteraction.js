// useNotificationInteraction.js
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { APP_TABS } from '../../navigation/ScreenNames';

const useNotificationInteraction = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // App opened from background via notification
    useEffect(() => {
        setLoading(true);

        const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('[useNotificationInteraction] Opened from background:', remoteMessage?.notification);
            setLoading(false);

            navigation.reset({
                index: 0,
                routes: [{ name: APP_TABS }],
            });
        });

        return unsubscribe;
    }, [navigation]);

    // App opened from quit state via notification
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const remoteMessage = await messaging().getInitialNotification();
                if (remoteMessage) {
                    console.log('[useNotificationInteraction] Opened from quit state:', remoteMessage);

                    navigation.reset({
                        index: 0,
                        routes: [{ name: APP_TABS }],
                    });
                }
            } catch (e) {
                console.log('[useNotificationInteraction] getInitialNotification error', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [navigation]);

    return {
        loading,
    };
};

export default useNotificationInteraction;
