import { useEffect, useState } from 'react';
import useSubscriptionContext from './useSubscriptionContext';
import getCurrencyFromPriceString from './utils/getCurrencyFromPriceString';
import isAndroid from './utils/isAndroid';
import roundDownNumber from './utils/roundDownNumber';
import getIntroPeriod from './utils/getIntroPeriod';
import useAuthContext from '../../hooks/auth/useAuthContext';
import androidSubscription from '../../../config/defaultFeatures/defaults/androidSubscription.json';
import { IS_ANDROID } from '../../theme/Layout';

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

    const {
        offerings, discountOfferings, introEligibility,
    } = useSubscriptionContext();

    // featureCurrentOffering = RevenueCat's `current` switch on their dashboard on an offering will
    // ensure it is placed on the top (irrespective of provided sortOrder)
    const { featureCurrentOffering } = options;

    useEffect(() => {
        (async () => {
            try {
                const allOfferings = offerings?.all && Object?.values(offerings?.all);
                const currentOffering = offerings?.current;

                const type = auth?.profile?.type === 'brand' ? 'Brands' : 'Creators';
                const allPackages = allOfferings?.map(({ availablePackages }) => availablePackages)?.flat();
                const allAvailablePackages = allPackages?.filter(({ offeringIdentifier }) => offeringIdentifier === type);

                if (allOfferings?.length) {
                    let sortOrderedPackages = allAvailablePackages;

                    if (featureCurrentOffering && !!currentOffering) {
                        const currentOfferingPackageProductIDs = currentOffering
                            ?.availablePackages
                            ?.map(({ product }) => product?.identifier);

                        // Put currentPackage first in array and filter it out of `all`
                        sortOrderedPackages = [
                            // Add it first
                            ...currentOffering?.availablePackages,

                            // Filter it out
                            ...sortOrderedPackages?.filter(
                                ({ product }) => currentOfferingPackageProductIDs?.indexOf(product.identifier) === -1,
                            ),
                        ];
                    }

                    const originalAvailableSortedPackages = sortOrderedPackages.map((pack) => {
                        const identifier = pack?.product?.identifier;
                        const product = pack?.product;
                        const discountInfo = discountOfferings && discountOfferings.find((d) => d?.identifier === identifier)?.discountInfo;

                        return {
                            ...pack,
                            product: {
                                ...product,
                                discountInfo,
                            },
                        };
                    });

                    setOriginalAvailablePackages(originalAvailableSortedPackages);

                    // run through packages and build correct Object
                    const availableSortedPackages = sortOrderedPackages.map((pack) => {
                        const identifier = pack?.product?.identifier;
                        const discount = discountOfferings && discountOfferings.find((d) => d?.identifier === identifier)?.discountInfo;
                        const product = pack?.product;
                        const isDiscountSale = !!discount;
                        const currency = getCurrencyFromPriceString(discount?.priceString);
                        const price = product?.price;
                        // discount sale prices
                        const discountPrice = discount?.price;
                        const discountPercent = ((price - discountPrice) / price) * 100;// todo check rounding
                        const discountDiff = 1 - (discountPercent / 100);
                        const originalPrice = (discount?.price / discountDiff).toFixed(2); // calculates based on the diff as the original price is incorrect
                        const savingString = `${currency}${(originalPrice - discount?.price).toFixed(2)}`;
                        const originalPriceString = `${currency}${originalPrice}`;

                        // intro sale prices
                        // eslint-disable-next-line camelcase
                        const introPrice = product?.introPrice;
                        const isIntroSale = isAndroid ? !!introPrice : introEligibility[identifier] && introPrice;
                        const introCurrency = getCurrencyFromPriceString(product?.introPrice?.priceString);
                        const introSavingPercent = ((price - introPrice) / price) * 100;// todo check rounding
                        const introDiff = 1 - (introSavingPercent / 100);
                        const originalIntroPrice = (introPrice / introDiff).toFixed(2);
                        const introSavingString = `${introCurrency}${(originalIntroPrice - introPrice).toFixed(2)}`;
                        const originalIntroPriceString = `${introCurrency}${originalIntroPrice}`;

                        const isSale = isDiscountSale || isIntroSale;
                        // price strings
                        // eslint-disable-next-line camelcase
                        const priceString = product?.priceString;
                        // eslint-disable-next-line camelcase
                        const introPriceString = product?.introPrice?.priceString;
                        const salePriceString = !isDiscountSale && isIntroSale ? introPriceString : discount?.priceString;

                        // eslint-disable-next-line no-nested-ternary
                        const savingPercent = isDiscountSale ? discountPercent : isIntroSale ? introSavingPercent : null;

                        // gets the original identifier to show correct metaData
                        const originalIdentifier = sortOrder?.find((sortIdentifier) => appPurchase?.metaData[sortIdentifier]?.discountKey === identifier);

                        const {
                            discountIntroPriceString,
                            introPriceCycle,
                            periodNumberOfUnits,
                            introPricePeriodUnit,
                            numberOfTotalIntroMonths,
                            numberOfTotalIntroMonthsUnit,
                            introPeriod,
                        } = getIntroPeriod(product, discount, isDiscountSale);

                        return {

                            ...appPurchase?.metaData[isAndroid ? pack?.identifier : identifier],
                            // eslint-disable-next-line no-nested-ternary
                            priceString: isSale ? salePriceString : priceString,
                            isSale,
                            // eslint-disable-next-line no-nested-ternary
                            savingString: isDiscountSale ? savingString : isIntroSale ? introSavingString : null,
                            // eslint-disable-next-line no-nested-ternary
                            originalPrice: isDiscountSale ? originalPriceString : isIntroSale ? originalIntroPriceString : null,
                            title: product?.title,
                            description: product?.description,
                            billed: '',
                            identifier,
                            price,
                            // eslint-disable-next-line no-nested-ternary
                            savingPercent: savingPercent ? roundDownNumber(savingPercent, appPurchase?.roundSavingPercentage) : 0,
                            discountIntroPriceString,
                            introPriceCycle,
                            periodNumberOfUnits,
                            introPricePeriodUnit,
                            numberOfTotalIntroMonths,
                            numberOfTotalIntroMonthsUnit,
                            introPeriod,
                            introPrice,
                        };
                    });

                    setAvailablePackages(availableSortedPackages);
                } else {
                    setAvailablePackages(false);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [offerings, discountOfferings, introEligibility, auth]);

    return [availablePackages, originalAvailablePackages];
};
