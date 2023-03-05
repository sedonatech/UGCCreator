import { keys } from 'lodash';
import Purchases from 'react-native-purchases';

export default () => {
    const subscribe = async (availablePackage) => {
        const purchaseMade = await Purchases.purchasePackage(availablePackage);
        if (typeof purchaseMade.purchaserInfo.entitlements.active.full_access !== 'undefined') {
            return true;
        } if (keys(purchaseMade?.purchaserInfo?.entitlements?.active)?.includes(availablePackage?.offeringIdentifier)) {
            return true;
        }
        throw new Error(purchaseMade.purchaserInfo);
    };
    return subscribe;
};
