import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';

const useNotificationInteraction = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
            setLoading(false);
            navigation.navigate(remoteMessage?.data?.type);
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                    navigation.navigate(remoteMessage?.data?.type);
                }
                setLoading(false);
            });
    }, []);

    return {
        loading,
    };
};

export default useNotificationInteraction;
