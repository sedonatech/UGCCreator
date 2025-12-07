// utils/getIntroPeriod.js
export default function getIntroPeriod(product, discount, isDiscountSale) {
    const introSource = !isDiscountSale ? product?.introPrice : discount;

    const introPriceString = !isDiscountSale ? product?.introPrice?.priceString ?? null : discount?.priceString ?? null;

    const introPrice = introSource?.price ?? 0;

    const periodNumberOfUnits = introSource?.periodNumberOfUnits != null ? introSource.periodNumberOfUnits : 0;

    const introPriceCycle = introSource?.cycles != null ? introSource.cycles : 0;

    let introPricePeriodUnit = introSource?.periodUnit ?? null;

    // Normalise unit to upper case string if present
    if (introPricePeriodUnit != null) {
        introPricePeriodUnit = String(introPricePeriodUnit).toUpperCase();
    }

    // No valid intro config, return empty meta
    if (!introPriceString || !periodNumberOfUnits || !introPriceCycle || !introPricePeriodUnit) {
        return {
            discountIntroPriceString: introPriceString,
            introPriceCycle: introPriceCycle || null,
            periodNumberOfUnits: periodNumberOfUnits || null,
            introPricePeriodUnit,
            numberOfTotalIntroMonths: null,
            numberOfTotalIntroMonthsUnit: null,
            introPeriod: null,
        };
    }

    const numberOfTotalIntroMonths = periodNumberOfUnits * introPriceCycle;
    const numberOfTotalIntroMonthsUnit = numberOfTotalIntroMonths > 1 ? 'months' : 'month';

    const additionalInfo = {
        discountIntroPriceString: introPriceString,
        introPriceCycle,
        periodNumberOfUnits,
        introPricePeriodUnit,
        numberOfTotalIntroMonths,
        numberOfTotalIntroMonthsUnit,
    };

    const unitLower = introPricePeriodUnit.toLowerCase();

    // Year special case
    if (introPricePeriodUnit === 'YEAR' || unitLower === 'year') {
        const baseText =
            introPrice === 0
                ? `Free trial for ${periodNumberOfUnits} ${unitLower}${periodNumberOfUnits > 1 ? 's' : ''}`
                : `${introPriceString}`;

        const tail = `for ${numberOfTotalIntroMonths} ${unitLower}${numberOfTotalIntroMonths > 1 ? 's' : ''}`;

        return {
            ...additionalInfo,
            introPeriod: `${baseText} ${tail}`,
        };
    }

    const unitLabel = `${periodNumberOfUnits > 1 ? `${periodNumberOfUnits} ` : ''}${unitLower}${
        periodNumberOfUnits > 1 ? 's' : ''
    }`;

    const periodText =
        introPrice === 0
            ? `Free trial for ${periodNumberOfUnits} ${unitLower}${periodNumberOfUnits > 1 ? 's' : ''}`
            : `${introPriceString} every ${unitLabel} for ${numberOfTotalIntroMonths} ${numberOfTotalIntroMonthsUnit}`;

    return {
        ...additionalInfo,
        introPeriod: periodText,
    };
}
