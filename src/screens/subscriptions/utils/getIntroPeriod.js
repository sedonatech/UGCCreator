export default (product, discount, isDiscountSale) => {
    const introPriceString = !isDiscountSale ? product?.introPrice?.priceString : discount?.priceString;
    const introPrice = product?.introPrice?.price;
    const periodNumberOfUnits = !isDiscountSale ? product?.introPrice?.periodUnit : discount?.periodNumberOfUnits;

    const introPriceCycle = !isDiscountSale ? product?.introPrice?.cycles : discount?.cycles;
    let introPricePeriodUnit = !isDiscountSale ? product?.introPrice?.periodNumberOfUnits : discount?.periodUnit;

    // if (introPriceString == null || periodNumberOfUnits === 0) return null;

    if (periodNumberOfUnits > 1) {
        introPricePeriodUnit = `${introPricePeriodUnit?.toUpperCase()}S`;
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

    if (introPricePeriodUnit === 'YEAR' || introPricePeriodUnit?.toLowerCase() === 'year') {
        return {
            ...additionalInfo,
            introPeriod: `${introPriceString === 0 ? `Free trial for ${periodNumberOfUnits} ${introPricePeriodUnit}` : `${introPriceString}`} for ${numberOfTotalIntroMonths} ${introPricePeriodUnit?.toLowerCase()}`,
        };
    }

    return {
        ...additionalInfo,
        introPeriod: `${introPrice === 0 ? `Free trial for ${periodNumberOfUnits} ${introPricePeriodUnit}` : `${introPriceString} every ${periodNumberOfUnits > 1 ? periodNumberOfUnits : ''}${periodNumberOfUnits > 1 ? ' ' : ''}${introPricePeriodUnit?.toLowerCase()} for ${numberOfTotalIntroMonths} ${numberOfTotalIntroMonthsUnit}`} `,
    };
};
