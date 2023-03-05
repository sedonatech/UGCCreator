import { useMemo } from 'react';
import useAvailablePackages from './useAvailablePackages';

export default (debug = false) => {
    const [, originalPackages] = useAvailablePackages();

    const userCurrency = useMemo(() => {
        if (!originalPackages?.length) {
            return null;
        }
        return originalPackages?.reduce((a, v) => {
            // eslint-disable-next-line camelcase
            if (v?.product?.currency_code && !a) {
                // eslint-disable-next-line camelcase
                a = v?.product?.currency_code;
            }
            return a;
        }, null);
    }, [originalPackages]);
    if (debug)console.log('[useUserCurrency] currency:', userCurrency);
    return userCurrency;
};
