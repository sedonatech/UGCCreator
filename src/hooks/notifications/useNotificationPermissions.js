// useNotificationPermissions.js
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import useFCMToken from './useFCMToken';
import { isIOS } from '../../Utils/Platform';

const useNotificationPermissions = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { createFCMToken } = useFCMToken();

    const ensureAndroidNotificationPermission = async () => {
        if (isIOS) return true;

        // Android 13+ needs POST_NOTIFICATIONS at runtime
        if (Platform.Version < 33) return true;

        const perm = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

        const currentStatus = await check(perm);

        if (currentStatus === RESULTS.GRANTED) {
            return true;
        }

        const newStatus = await request(perm);

        return newStatus === RESULTS.GRANTED;
    };

    const checkApplicationPermissions = async () => {
        try {
            // Android permission runtime first
            const androidOk = await ensureAndroidNotificationPermission();
            if (!androidOk) {
                setIsAuthorized(false);
                return false;
            }

            // iOS + Android FCM permission
            const authStatus = await messaging().hasPermission();
            const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

            if (!enabled) {
                return false;
            }

            setIsAuthorized(true);

            // Make sure the device is registered
            await messaging().registerDeviceForRemoteMessages();

            return true;
        } catch (error) {
            console.log('[useNotificationPermissions] checkApplicationPermissions error', error);
            setIsAuthorized(false);
            return false;
        }
    };

    const requestApplicationPermissions = async () => {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

            if (!enabled) {
                setIsAuthorized(false);
                return false;
            }

            setIsAuthorized(true);
            await messaging().registerDeviceForRemoteMessages();
            return true;
        } catch (error) {
            console.log('[useNotificationPermissions] requestApplicationPermissions error', error);
            setIsAuthorized(false);
            return false;
        }
    };

    useEffect(() => {
        (async () => {
            // 1. Check current status
            const alreadyEnabled = await checkApplicationPermissions();

            // 2. If not enabled, request it once (you can later move this behind a UI button)
            if (!alreadyEnabled) {
                await requestApplicationPermissions();
            }
        })();
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            // Only create FCM token once you know permissions/registration are done
            createFCMToken();
        }
    }, [isAuthorized, createFCMToken]);

    return {
        checkApplicationPermissions,
        isAuthorized,
    };
};

export default useNotificationPermissions;
