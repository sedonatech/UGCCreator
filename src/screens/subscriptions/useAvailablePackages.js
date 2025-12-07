import { useEffect, useState } from 'react';
import useSubscriptionContext from './useSubscriptionContext';
import getCurrencyFromPriceString from './utils/getCurrencyFromPriceString';
import isAndroid from './utils/isAndroid';
import roundDownNumber from './utils/roundDownNumber';
import getIntroPeriod from './utils/getIntroPeriod';
import useAuthContext from '../../hooks/auth/useAuthContext';
import androidSubscription from '../../../config/defaultFeatures/defaults/androidSubscription.json';
import { IS_ANDROID } from '../../theme/Layout';

// Treat everything in "month units" for relative discount math:
// YEAR = 12 months, MONTH = 1 month, WEEK = 0.25 month, DAY = 1/30 month.
const unitToMonths = unit => {
    switch (unit) {
        case 'YEAR':
            return 12;
        case 'MONTH':
            return 1;
        case 'WEEK':
            return 1 / 4;
        case 'DAY':
            return 1 / 30;
        default:
            return 0;
    }
};

const parseIso8601PeriodToMonths = iso => {
    if (!iso || typeof iso !== 'string') return 0;

    const match = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?$/i.exec(iso);
    if (!match) return 0;

    const years = parseInt(match[1] || '0', 10);
    const months = parseInt(match[2] || '0', 10);
    const weeks = parseInt(match[3] || '0', 10);
    const days = parseInt(match[4] || '0', 10);

    return years * 12 + months + weeks / 4 + days / 30;
};

/**
 * Calculate the discounted price for the first paid period,
 * based on a free intro period.
 *
 * Example:
 * - subscriptionPeriod: P1M (1 month)
 * - introPrice: { periodUnit: 'WEEK', periodNumberOfUnits: 1, cycles: 1, price: 0 }
 * - originalPrice: 9.99
 * => 1 week off out of "4 weeks in a month" => 25% off => 7.49
 */
const getIntroDiscountPrice = (originalPrice, subscriptionPeriodIso, introPriceObject) => {
    if (typeof originalPrice !== 'number' || !subscriptionPeriodIso || !introPriceObject) {
        return null;
    }

    // Only treat free intro time as a "time off" discount
    if (typeof introPriceObject.price !== 'number' || introPriceObject.price > 0) {
        return null;
    }

    const subscriptionMonths = parseIso8601PeriodToMonths(subscriptionPeriodIso);
    if (!subscriptionMonths) return null;

    const introMonths =
        (introPriceObject.periodNumberOfUnits || 0) *
        (introPriceObject.cycles || 1) *
        unitToMonths(introPriceObject.periodUnit);

    if (!introMonths) return null;

    // Fraction of the normal period that is free
    const freeFraction = Math.min(introMonths / subscriptionMonths, 1);

    const discountAmount = originalPrice * freeFraction;
    const discountedPrice = Number((originalPrice - discountAmount).toFixed(2));

    return {
        discountedPrice,
        discountPercent: Math.round(freeFraction * 100),
        discountAmount: Number(discountAmount.toFixed(2)),
    };
};

export default (
    purchase,
    options = {
        featureCurrentOffering: false,
    },
) => {
    const appPurchase = IS_ANDROID ? androidSubscription?.purchase : purchase;

    const sortOrder = appPurchase?.sortOrder || appPurchase;
    const [availablePackages, setAvailablePackages] = useState(null);
    const [originalAvailablePackages, setOriginalAvailablePackages] = useState(null);

    const { auth } = useAuthContext();
    const { offerings, discountOfferings, introEligibility } = useSubscriptionContext();

    const { featureCurrentOffering } = options;

    // normalise platform flag, keep old util name working
    const isAndroidPlatform = typeof isAndroid === 'function' ? isAndroid() : !!isAndroid || !!IS_ANDROID;

    useEffect(() => {
        (async () => {
            try {
                const allOfferings = offerings?.all && Object.values(offerings?.all || {});
                const currentOffering = offerings?.current;

                const type = auth?.profile?.type === 'brand' ? 'Brands' : 'Creators';

                const allPackages = allOfferings?.map(({ availablePackages }) => availablePackages)?.flat() || [];

                const allAvailablePackages = allPackages?.filter(
                    ({ offeringIdentifier }) => offeringIdentifier === type,
                );

                if (allOfferings?.length && allAvailablePackages?.length) {
                    let sortOrderedPackages = allAvailablePackages;

                    if (featureCurrentOffering && currentOffering) {
                        const currentOfferingPackageProductIDs =
                            currentOffering?.availablePackages?.map(({ product }) => product?.identifier) || [];

                        // current offering first
                        sortOrderedPackages = [
                            ...currentOffering?.availablePackages,
                            ...sortOrderedPackages.filter(
                                ({ product }) => currentOfferingPackageProductIDs.indexOf(product.identifier) === -1,
                            ),
                        ];
                    }

                    // keep the original RevenueCat packages (used for purchase())
                    const originalAvailableSortedPackages = sortOrderedPackages.map(pack => {
                        const identifier = pack?.product?.identifier;
                        const product = pack?.product;
                        const discountInfo =
                            discountOfferings &&
                            discountOfferings.find(d => d?.identifier === identifier)?.discountInfo;

                        return {
                            ...pack,
                            product: {
                                ...product,
                                discountInfo,
                            },
                        };
                    });

                    setOriginalAvailablePackages(originalAvailableSortedPackages);

                    const availableSortedPackages = sortOrderedPackages.map(pack => {
                        const identifier = pack?.product?.identifier;
                        const product = pack?.product;

                        const basePrice = typeof product?.price === 'number' ? product.price : 0;
                        const basePriceString = product?.priceString;

                        const discount =
                            discountOfferings &&
                            discountOfferings.find(d => d?.identifier === identifier)?.discountInfo;

                        const hasDiscountSale = !!discount && typeof discount.price === 'number';

                        const currency = getCurrencyFromPriceString(
                            (discount && discount.priceString) || basePriceString,
                        );

                        // base values
                        let priceString = basePriceString;
                        let originalPriceString = null;
                        let savingString = null;
                        let savingPercentRaw = 0;

                        // 1) discount sale (real lower recurring price via discountOfferings)
                        if (hasDiscountSale && basePrice > 0) {
                            const salePriceNumber = discount.price;
                            const salePriceString = discount.priceString;

                            priceString = salePriceString;
                            originalPriceString = basePriceString;

                            const diff = basePrice - salePriceNumber;
                            if (diff > 0) {
                                savingPercentRaw = (diff / basePrice) * 100;
                                savingString = `${currency}${diff.toFixed(2)}`;
                            }
                        }

                        // 2) intro offer (free time at start of normal subscription)
                        // Prefer product.introPrice (RevenueCat IntroductoryPrice)
                        const introPriceObject = product?.introPrice || null;

                        let introPriceString = null;
                        let hasIntroDiscount = false;
                        let introDiscountInfo = null;

                        if (introPriceObject && product.subscriptionPeriod && basePrice > 0) {
                            introDiscountInfo = getIntroDiscountPrice(
                                basePrice,
                                product.subscriptionPeriod,
                                introPriceObject,
                            );
                        }

                        if (introDiscountInfo && typeof introDiscountInfo.discountedPrice === 'number') {
                            const d = introDiscountInfo.discountedPrice;

                            introPriceString = `${currency}${d.toFixed(2)}`;
                            hasIntroDiscount = true;

                            // use intro-based saving only if there is no separate discount sale
                            if (!hasDiscountSale) {
                                savingPercentRaw = introDiscountInfo.discountPercent;
                                savingString = `${currency}${introDiscountInfo.discountAmount.toFixed(2)}`;
                            }

                            // for intros original price is always the base subscription price
                            if (!originalPriceString) {
                                originalPriceString = basePriceString;
                            }
                        }

                        const isSale = hasDiscountSale || hasIntroDiscount;

                        const {
                            discountIntroPriceString,
                            introPriceCycle,
                            periodNumberOfUnits,
                            introPricePeriodUnit,
                            numberOfTotalIntroMonths,
                            numberOfTotalIntroMonthsUnit,
                            introPeriod,
                        } = getIntroPeriod(product, discount, hasDiscountSale);

                        return {
                            // metadata (label, showSaving, freeTrial, etc.)
                            ...appPurchase?.metaData[isAndroidPlatform ? pack?.identifier : identifier],

                            // main price label shown on the card (base or discount sale)
                            priceString,

                            // flags and savings
                            isSale,
                            title: pack?.label || '',
                            savingString,
                            originalPrice: originalPriceString || basePriceString, // always fall back to base

                            price: basePrice,

                            savingPercent: savingPercentRaw
                                ? roundDownNumber(savingPercentRaw, appPurchase?.roundSavingPercentage)
                                : 0,

                            discountIntroPriceString,
                            introPriceCycle,
                            periodNumberOfUnits,
                            introPricePeriodUnit,
                            numberOfTotalIntroMonths,
                            numberOfTotalIntroMonthsUnit,
                            introPeriod,

                            // TWO prices you care about:
                            // - originalPrice = base subscription price (string, e.g. '$9.99')
                            // - introPrice = effective first-period price after free time (string, e.g. '$7.49')
                            introPrice: introPriceString, // null if there is no free intro

                            // keep full RC intro object for reference if needed anywhere else
                            introPriceObject,
                        };
                    });

                    setAvailablePackages(availableSortedPackages);
                } else {
                    setAvailablePackages(false);
                }
            } catch (error) {
                console.error(error);
                setAvailablePackages(false);
            }
        })();
    }, [offerings, discountOfferings, introEligibility, auth, featureCurrentOffering]);

    return [availablePackages, originalAvailablePackages];
};
