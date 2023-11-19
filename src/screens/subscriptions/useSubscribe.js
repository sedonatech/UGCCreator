import Purchases from 'react-native-purchases';

export default () => {
    const subscribe = async (availablePackage) => {
        const purchaseMade = await Purchases.purchasePackage(availablePackage);
        if (typeof purchaseMade.customerInfo.entitlements.active.full_access !== 'undefined') {
            return true;
        } if (Object.keys(purchaseMade?.customerInfo?.entitlements?.active)?.includes(availablePackage?.offeringIdentifier)) {
            return true;
        }
        throw new Error(purchaseMade.customerInfo);
    };
    return subscribe;
};
