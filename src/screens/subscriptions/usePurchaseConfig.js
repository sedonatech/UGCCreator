import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';

const buildPurchaseConfig = (subKeys, purchase) => {
    if (!subKeys || !subKeys?.main) {
        return purchase;
    }
    const newPurchase = {
        ...purchase,
    };
    // adds the sort order to the purchase object
    if (newPurchase?.sortOrder && Array.isArray(newPurchase?.sortOrder)) {
        newPurchase.sortOrder = newPurchase?.sortOrder?.map((key) => subKeys?.main[key]);
    }
    // adds the discount key to the metaData object in the purchase object
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
    // used for single purchase objects
    if (newPurchase?.singleDiscount) {
        const singleDiscount = newPurchase?.singleDiscount;
        singleDiscount.eligibleIdentifiers = singleDiscount.eligibleIdentifiers?.map((id) => subKeys.main[id]);
        singleDiscount.originalKey = subKeys.main[singleDiscount.originalKey];
        singleDiscount.discountKey = subKeys.singleDiscount[Platform.OS];
        newPurchase.singleDiscount = singleDiscount;
    }

    return newPurchase;
};

export default (debug = false) => {
    const { subscription } = useFeatureFlags();

    const [config, setConfig] = useState({});

    useEffect(() => {
        if (debug)console.log('[useSubscriptionConfig]-purchase:', subscription?.purchase, '\n', 'keys:', subscription?.keys);
        if (subscription?.purchase && subscription?.keys) {
            // creates the new purchase object with the updated keys from remote config.
            const newConfig = buildPurchaseConfig(subscription?.keys, subscription?.purchase);
            setConfig(newConfig);
        }
    }, [subscription]);

    return config;
};
