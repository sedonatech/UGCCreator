import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import useFeatureFlags from '../featureFlags/useFeatureFlags';
import useAuthContext from '../auth/useAuthContext';
import androidSubscription from '../../../config/defaultFeatures/index';
import { IS_ANDROID } from '../../theme/Layout';

const buildPurchaseConfig = (subKeys, purchase) => {
    if (!subKeys || !subKeys?.main) {
        return purchase;
    }
    const newPurchase = {
        ...purchase,
    };
    if (newPurchase?.sortOrder && Array.isArray(newPurchase?.sortOrder)) {
        newPurchase.sortOrder = newPurchase?.sortOrder?.map((key) => subKeys?.main[key]);
    }
    if (newPurchase?.metaData && subKeys?.discount) {
        const newMetaData = {};
        Object.keys(subKeys.main).forEach((metaDataKey) => {
            newMetaData[subKeys.main[metaDataKey]] = {
                ...newPurchase.metaData[metaDataKey],
                discountKey: subKeys.discount[Platform.OS][metaDataKey],
            };
        });
        newPurchase.metaData = newMetaData;
    }

    if (newPurchase?.singleDiscount) {
        const singleDiscount = {
            ...newPurchase?.singleDiscount,
        };
        singleDiscount.eligibleIdentifiers = singleDiscount.eligibleIdentifiers?.map((id) => subKeys.main[id]);
        singleDiscount.originalKey = subKeys.main[singleDiscount.originalKey];
        singleDiscount.discountKey = subKeys.singleDiscount[Platform.OS];
        newPurchase.singleDiscount = singleDiscount;
    }

    return newPurchase;
};
const useSubscriptionConfig = (debug = false) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const { subscription: creatorSubscription, brandSubscription } = useFeatureFlags();

    const subscription = useMemo(() => {
        if (profile?.type === 'brand') {
            return brandSubscription;
        }
        return creatorSubscription;
    }, [brandSubscription, creatorSubscription, profile]);

    const [config, setConfig] = useState({});

    useEffect(() => {
        if (debug)console.log('[useSubscriptionConfig]', '\n', 'purchase:', subscription?.purchase, '\n', 'keys:', subscription?.keys);
        if (subscription?.purchase && subscription?.keys) {
            const newConfig = buildPurchaseConfig(subscription?.keys, subscription?.purchase);
            setConfig(newConfig);
        }
    }, [subscription]);

    return config;
};

export default useSubscriptionConfig;
