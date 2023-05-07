import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import useFCMToken from './useFCMToken';

const useNotificationPermissions = () => {
    const [isAuthorized, setIsAuthorized] = useState();

    const { createFCMToken } = useFCMToken();

    const checkApplicationPermissions = async () => {
        try {
            const authorizationStatus = await messaging().requestPermission(
                {
                    alert: true,
                    announcement: true,
                    badge: true,
                    carPlay: false,
                    criticalAlert: false,
                    provisional: false,
                    sound: true,
                },
            );

            if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const registerDevice = async () => {
        try {
            const response = await messaging().registerDeviceForRemoteMessages();
            if (response) {
                checkApplicationPermissions();
            }
        } catch (error) {
            console.log('error', error);
        }
    };
    useEffect(() => {
        registerDevice();
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            createFCMToken();
        }
    }, [isAuthorized]);

    return {
        checkApplicationPermissions,
        isAuthorized,
    };
};

export default useNotificationPermissions;
