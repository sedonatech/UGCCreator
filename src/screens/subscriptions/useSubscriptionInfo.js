import { useState, useEffect, useContext } from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import { STATUSES } from './consts';
import { CoreContext } from '../../context/core';
import useSubscriptionContext from './useSubscriptionContext';

export default () => {
    const [status, setStatus] = useState(null);
    const { overrideSubscription } = useContext(CoreContext);
    const { purchaserInfo } = useSubscriptionContext();

    const {
        NO_PURCHASES, EXPIRED, CANCELLED, ACTIVE,
    } = STATUSES;

    useEffect(() => {
        // NOTE: Only full_access accounted for currently, more options to be added at a later date
        (async () => {
            try {
                console.log('purchaserInfo: ', purchaserInfo);
                const entitlement = purchaserInfo?.entitlements?.all?.full_access;
                console.log('expiration: ', differenceInDays(new Date(entitlement?.expirationDate), new Date()));

                if (entitlement == null) {
                    // If no entitlement at all, set NO_PURCHASES
                    setStatus(NO_PURCHASES);
                } else if (!entitlement?.isActive) {
                    // If had entitle and expired, set expired
                    setStatus(EXPIRED);
                } else if (!entitlement?.willRenew && differenceInDays(new Date(entitlement?.expirationDate), new Date()) < 30) {
                    // If has entitlement but isn't renewing, set cancelled
                    // Note: lifetime subs are actually subs for ~200 years, so are always !willRenew
                    // Only show cancellation if the expiration date is in the next 30 days
                    setStatus(CANCELLED);
                } else if ((!!entitlement && entitlement?.willRenew && entitlement?.isActive) || !!overrideSubscription) {
                    // If has entitlment and renewing (or overridden), set active
                    setStatus(ACTIVE);
                }
            } catch (e) {
                console.log('[subscriptions] ERROR: useSubscriptionInfo: ', e.message);
                // TODO: Improve logging
            }
        })();
    }, [overrideSubscription, purchaserInfo]);

    return { status };
};
