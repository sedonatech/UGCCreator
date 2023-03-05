import { useEffect, useState } from 'react';
import findProductIdentifier from './utils/findProductIdentifier';
import useSubscriptionContext from './useSubscriptionContext';
import { useConfig } from '../../context/core';

/**
 * @typedef {Object} Entitlement
 * @property {string} identifier - The entitlement identifier configured in RevenueCat.
 * @property {string} productIdentifier - The product identifier configured in RevenueCat.
 * @property {string} expiresDate - The date when the entitlement will expire.
 * @property {string} purchaseDate - The date when the entitlement was purchased.
 * @property {string} store - The store where the entitlement was purchased.
 * @property {string} isSandbox - Whether or not the purchase was made in sandbox.
 * @property {string} unsubscribeDetectedAt - The date when the user unsubscribed from the entitlement.
 * @property {string} billingIssueDetectedAt - The date when a billing issue was detected for the entitlement.
 */

export default (
    purchaseProductIdentifier = null,
    options = {
        expandData: false,
    },
) => {
    const [entitlements, setEntitlements] = useState([]);
    const { purchaserInfo } = useSubscriptionContext();
    const { expandData } = options;

    const { overrideEntitlements, overrideSubscription } = useConfig();

    useEffect(() => {
        if (overrideSubscription && overrideEntitlements) {
            setEntitlements(overrideEntitlements);
            return;
        }
        if (purchaserInfo) {
            setEntitlements(
                Object
                    ?.values(purchaserInfo?.entitlements?.active)
                    ?.map((entitlement) => {
                        if (purchaseProductIdentifier && !!entitlement) {
                            const identifier = findProductIdentifier(entitlement?.identifier,
                                purchaseProductIdentifier);
                            if (expandData) {
                                return {
                                    ...entitlement,
                                    identifier,
                                };
                            }
                            return identifier;
                        }
                        if (expandData) return entitlement;
                        return entitlement?.identifier;
                    }),
            );
        }
    }, [purchaserInfo]);

    return entitlements;
};
