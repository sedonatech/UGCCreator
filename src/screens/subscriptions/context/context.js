import React, {
    useState, useEffect, createContext,
} from 'react';
import Purchases from 'react-native-purchases';
import PropTypes from 'prop-types';

import useInitPurchases from '../useInitPurchases';
import isAndroid from '../utils/isAndroid';
import findDefaultDiscountKey from '../utils/findDefaultDiscountKey';

const SubscriptionContext = createContext(null);
const { Provider, Consumer: SubscriptionConsumer } = SubscriptionContext;

const SubscriptionProvider = ({ children, purchase }) => {
    const [ready, userEmail] = useInitPurchases();

    const [store, setStore] = useState({
        offerings: null,
        purchaserInfo: null,
        discountOfferings: null,
        discountPackages: null,
        error: null,
        introEligibility: {},
        ready: false,
        hasSubscription: null,
        purchase,
    });

    const [userEligible, setUserEligible] = useState(true);

    // Updater
    const update = (key, data) => {
        console.log('[Subscription] Subscription Provider: Update called, updating store: ', key, data);
        setStore((prevState) => ({
            ...prevState,
            [key]: data,
        }));
    };

    // when purchase is updated from remote config, update the store with the purchase object and ready state
    useEffect(() => {
        if (Object.keys(purchase)?.length && ready) {
            update('purchase', purchase);
            update('ready', ready);
        }
    }, [purchase, ready]);

    useEffect(() => {
        (async () => {
            if (ready && userEmail) {
                try {
                    Purchases.addCustomerInfoUpdateListener((purchaserInfo) => {
                        update('purchaserInfo', purchaserInfo);
                    });
                } catch (e) {
                    console.log('[addCustomerInfoUpdateListener] - ERROR', e);
                    alert(JSON.stringify(e));
                }

                try {
                    await Purchases.setAttributes({ $email: userEmail });
                } catch (e) {
                    console.log('[Purchases Attributes] - Error', e);
                }
            }
        })();
    }, [ready, userEmail]);

    useEffect(() => {
        (async () => {
            if (ready) {
                try {
                    const offerings = await Purchases.getOfferings();
                    update('offerings', offerings);
                } catch (e) {
                    console.log('[Subscription] Error fetching offerings', e);
                }
            }
        })();
    }, [ready, store?.purchaserInfo]);

    useEffect(() => {
        setStore({ ...store });
        console.log('[Subscription] Subscription Provider: Configured store');
    }, []);

    useEffect(() => {
        (async () => {
            if (ready && store?.offerings) {
                const allOfferings = store?.offerings?.all && Object?.values(store?.offerings?.all);
                const allAvailablePackages = allOfferings?.map(({ availablePackages }) => availablePackages)?.flat();
                const productIdentifiers = allAvailablePackages?.map(({ product }) => product?.identifier);
                const introEligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility(productIdentifiers);
                update('introEligibility', Object.fromEntries(
                    Object.entries(introEligibility).map((pair) => [pair[0], pair[1]?.status === 2]),
                ));
            }
        })();
    }, [store?.offerings, ready]);

    // check if user is eligible for discounts and add
    useEffect(() => {
        (async () => {
            // if the user is eligible and they are not a new customer, check for discounts and map it to discountOfferings
            if (!isAndroid && Object.keys(store?.introEligibility)?.length) {
                // get the available packages
                const allOfferings = store?.offerings?.all && Object?.values(store?.offerings?.all);
                const allAvailablePackages = allOfferings?.map(({ availablePackages }) => availablePackages)?.flat().filter(({ product }) => !store?.introEligibility[product?.identifier]);
                const discountOfferings = await Promise.all(allAvailablePackages?.map(async ({ product }, index) => {
                    // map over the packages to check if discount is available
                    try {
                        const productIdentifier = product?.identifier;
                        const discountInfo = product?.discounts?.length && product?.discounts?.find((d) => d?.identifier === purchase?.metaData[productIdentifier]?.discountKey
                            || d?.identifier === findDefaultDiscountKey(product));
                        // if there is a valid discount identifier, get the payment discount
                        // NOTE: Swapped this to always checking for reliability, monitor speed in prod
                        const discount = !!discountInfo && await Purchases.getPromotionalOffer(product, discountInfo);
                        // const discount = !!discountInfo || index >= 1 || await Purchases.getPromotionalOffer(product, discountInfo);

                        // if there is a discount, return to build discount array
                        if (discount && discountInfo) {
                            console.log('[Subscription Context] - discountInfo', discountInfo);
                            return {
                                identifier: product?.identifier,
                                discountInfo,
                                product,
                            };
                        }
                        return null;
                    } catch (e) {
                        console.log('[Subscription Context] - discountPackages Error', e);
                        setUserEligible(false);
                        update('error', e);
                        return null;
                    }
                }));
                // filter out the null packages, if there are set to context to be used on useAvailablePackages
                if (discountOfferings?.filter((d) => !!d)?.length) {
                    // console.log('[Subscription Context] - DiscountPackages', discountPackages);
                    update('discountOfferings', discountOfferings?.filter((d) => !!d));
                }
            }
        })();
    }, [store?.introEligibility]);

    // get all the discounts available from discountOfferings and set to context for purchase
    useEffect(() => {
        (async () => {
            try {
                if (store?.discountOfferings?.length && !isAndroid) {
                    const discountPackages = await Promise.all(store?.discountOfferings.map(async ({ product, discountInfo, identifier }) => {
                        const discount = !!discountInfo && await Purchases.getPromotionalOffer(product, discountInfo);
                        if (discount) {
                            return {
                                discountPackage: discount,
                                identifier,
                            };
                        }
                        return null;
                    }));
                    // console.log('DISCOUNT PACKS', discountPackages);
                    if (discountPackages.filter((d) => !!d)?.length) {
                        update('discountPackages', discountPackages.filter((d) => !!d));
                    }
                }
            } catch (e) {
                console.log('[subscription context] - discountOfferings check', e);
            }
        })();
    }, [store?.discountOfferings]);

    return (
        <Provider value={{ ...store, update }}>
            {children}
        </Provider>
    );
};

SubscriptionProvider.propTypes = {
    children: PropTypes.node,
    purchase: PropTypes.shape({
        sortOrder: PropTypes.arrayOf(PropTypes.string),
        metaData: PropTypes.shape({}),
    }),
};

SubscriptionProvider.defaultProps = {
    children: null,
    purchase: null,
};

export {
    SubscriptionContext,
    SubscriptionProvider,
    SubscriptionConsumer,
};
