import { get, keys } from 'lodash';
import Purchases from 'react-native-purchases';
import useSubscriptionContext from './useSubscriptionContext';

export default () => {
    const {
        discountPackages,
    } = useSubscriptionContext();

    const onPurchase = async (availablePackage) => {
        if (!availablePackage) {
            throw Error('No selected package option');
        }

        // product identifier
        const identifier = get(availablePackage, 'product.identifier', null);
        // discountInfo - used to check if there was a discount
        const discountInfo = get(availablePackage, 'product.discountInfo', false);

        // gets the actual discount from discountPurchases
        const discount = !!discountInfo && discountPackages?.find((p) => p?.identifier === identifier)?.discountPackage;

        console.log('[usePurchase] - onPurchase', discountInfo, discount);

        const onPurchasePackage = async () => {
            if (discount) {
                const discountPackage = await Purchases.purchaseDiscountedPackage(availablePackage, discount);
                return discountPackage;
            }
            const purchasePackage = await Purchases.purchasePackage(availablePackage);
            return purchasePackage;
        };

        const purchaseMade = await onPurchasePackage();

        if (typeof get(purchaseMade, 'purchaserInfo.entitlements.active.full_access') !== 'undefined') {
            return true;
        }
        if (keys(purchaseMade?.purchaserInfo?.entitlements?.active)?.includes(availablePackage?.offeringIdentifier)) {
            return true;
        }
        throw new Error(purchaseMade.purchaserInfo);
    };

    return onPurchase;
};
