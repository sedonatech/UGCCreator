import { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSubscriptionContext from './useSubscriptionContext';
import { CoreContext } from '../../context/core';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';

const storageKey = '@hasSubscription';

export default (expiryLength = 7, debug = true) => {
    const { overrideSubscriptionStorage } = useContext(CoreContext);

    const { purchaserInfo, hasSubscription, update } = useSubscriptionContext();

    const { features } = useFeatureFlags();

    const overrideSubscription = __DEV__ ? true : features?.subscription?.overrideSubscription;

    const setHasSubscription = (value) => update('hasSubscription', value);

    const updateAsync = async (hasLocalSubscription = false, expiryDate) => {
        try {
            const now = new Date();
            now.setDate(now.getDate() + expiryLength);
            await AsyncStorage.setItem(storageKey, JSON.stringify({
                hasSubscription: hasLocalSubscription,
                expiryDate: expiryDate || now.toISOString(),
            }));
            if (debug)console.log('[subscriptions] - updateAsyncStore:', { hasLocalSubscription, expiryDate });
        } catch (e) {
            console.log('[subscriptions] ERROR: updateAsyncStorage:', e);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                if (overrideSubscription) {
                    setHasSubscription(true);
                    await updateAsync(true);
                } else if (process.env.DETOX_TEST_RUNNING) {
                    setHasSubscription(false);
                } else if (purchaserInfo !== null) {
                    const hasPurchase = purchaserInfo?.entitlements?.active?.pro?.isActive;
                    setHasSubscription(hasPurchase);
                    await updateAsync(hasPurchase);
                }
            } catch (e) {
                setHasSubscription(false);
                console.log('[subscriptions] ERROR: CheckUserRequiresSubscription: ', e.message);
                // TODO: Improve logging
            }
        })();
    }, [overrideSubscription, purchaserInfo]);

    useEffect(() => {
        (async () => {
            try {
                // check if the users has purchaseInfo, if so use that info to update checks
                if (purchaserInfo || hasSubscription != null || overrideSubscriptionStorage) {
                    return;
                }
                // get local subscription check
                const localSubscriptionCheck = await AsyncStorage.getItem(storageKey);

                // if there is a local subscription check, run through the saved data
                if (localSubscriptionCheck) {
                    const localJsonCheck = JSON.parse(localSubscriptionCheck);
                    if (debug)console.log('[subscriptions] - LOCALE SUBSCRIPTION', localJsonCheck);

                    const localHasSubscription = localJsonCheck?.hasSubscription;
                    const localExpiry = localJsonCheck?.expiryDate;
                    // check expiry date, if before today set and update to storage details
                    if (new Date() < new Date(localExpiry)) {
                        setHasSubscription(localHasSubscription);
                        await updateAsync(localHasSubscription);
                    } else {
                        // set defaults
                        setHasSubscription(false);
                        await updateAsync(false);
                    }
                } else {
                    // if no local subscription check, set to defaults.
                    if (debug)console.log('[subscriptions] - LOCAL SUBSCRIPTION DEFAULT');
                    await updateAsync(false);
                }
            } catch (e) {
                console.log('[subscriptions] ERROR: check local subscription', e);
            }
        })();
    }, [purchaserInfo, hasSubscription, overrideSubscriptionStorage]);

    return { hasSubscription, purchaserInfo };
};
