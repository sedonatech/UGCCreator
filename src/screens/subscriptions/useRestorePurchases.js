import Purchases from 'react-native-purchases';

export default () => {
    const restorePurchases = async () => {
        try {
            await Purchases.restorePurchases();
            return true;
        } catch (e) {
            console.log('[useRestorePurchases] - Error', e);
            return e;
        }
    };
    return restorePurchases;
};
