import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { useState, useEffect } from 'react';

import useSubscribe from './useSubscribe';
import useSubscriptionContext from './useSubscriptionContext';
import useAvailablePackage from './useAvailablePackage';

// packageKey is the key for the package (eg) com.appname.monthly.app)
// DiscountKey is the key from app store connect for ios
export default Platform.select({
    ios: (packageKey, discountKey) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [response, setResponse] = useState([]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const availablePackage = useAvailablePackage(packageKey);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { purchaserInfo } = useSubscriptionContext();

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            (async () => {
                try {
                    const product = availablePackage?.product;

                    const previousEntitlementPurchase = purchaserInfo?.entitlements?.all?.full_access;
                    // Is eligible iOS user if: has a purchase from the app store that isn't sandbox
                    const eligible = !!previousEntitlementPurchase && (previousEntitlementPurchase?.store === 'APP_STORE' && previousEntitlementPurchase?.isSandbox !== true);

                    if (!eligible) {
                        setResponse([null]);
                    } else {
                    // Get discount info and validated discount purchase function
                        const discountInfo = product?.discounts?.find(
                            ({ identifier }) => identifier === discountKey,
                        );

                        if (!discountInfo) {
                            throw new Error(`No discount found for key: ${discountKey}`);
                        }

                        let discount;
                        try {
                            discount = await Purchases.getPromotionalOffer(product, discountInfo);
                        } catch (error) {
                            console.warn('No eligible discount');
                        }

                        if (discount) {
                            setResponse([
                                discountInfo,
                                () => Purchases.purchaseDiscountedPackage(availablePackage, discount),
                            ]);
                        }
                    }
                } catch (e) {
                    console.log('[subscriptions] ERROR: useDiscount: ', e.message);
                    // TODO: Improve logging
                }
            })();
        }, [availablePackage, discountKey, purchaserInfo]);

        return response;
    },
    android: (packageKey, discountKey) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const availablePackage = useAvailablePackage(discountKey);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const subscribe = useSubscribe();
        const purchase = () => subscribe(availablePackage);

        return [availablePackage, purchase];
    },

});
