import { useState, useEffect } from 'react';
import Purchases from 'react-native-purchases';
import useSubscriptionContext from './useSubscriptionContext';

/**
 * @typedef {Object} purchaseInfo
 * @property {Object} entitlements
 */

/**
 * @name useRefetchSubscription
 * @description a custom hook to return purchaser info from subscription context,
 * if purchaser info is null, hook retries 3 times to fetch the purchase info
 * with a second delay between each try.
 * @returns {purchaseInfo}
 */
export default () => {
    const [count, setCount] = useState(0);
    const { purchaserInfo, update, ready } = useSubscriptionContext();

    useEffect(() => {
        if (ready && purchaserInfo === null && count <= 3) {
            setTimeout(async () => {
                try {
                    const purchaseInfo = await Purchases.getCustomerInfo();
                    console.log('[useRefetchSubscription]- re fetching subscription info', purchaseInfo, 'count:', count);
                    // access latest purchaserInfo
                    update('purchaserInfo', purchaseInfo);
                } catch (e) {
                    // Error fetching purchaser info
                    console.log('[useRefetchSubscription] - error', e);
                    setCount(count + 1);
                }
            }, 1000);
        }
    }, [purchaserInfo, count, ready]);

    return purchaserInfo;
};
