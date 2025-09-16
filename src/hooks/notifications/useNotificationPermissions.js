import { useEffect, useState } from 'react';
import { getMessaging } from '@react-native-firebase/messaging';
import useFCMToken from './useFCMToken';

const useNotificationPermissions = () => {
    const [isAuthorized, setIsAuthorized] = useState();

    const { createFCMToken } = useFCMToken();

    const checkApplicationPermissions = async () => {
        try {
            const authorizationStatus = await getMessaging().hasPermission();
            setIsAuthorized(authorizationStatus === getMessaging().AuthorizationStatus.AUTHORIZED);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        checkApplicationPermissions();
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
