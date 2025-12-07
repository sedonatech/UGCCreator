// utils/getIntroPeriod.js

export default function getIntroPeriod(product, discount, isDiscountSale) {
    // Source of intro data:
    // - normal intro: product.introPrice or first StoreKit discount
    // - discounted intro (promo via discountOfferings): discount
    const introSource = !isDiscountSale
        ? product?.introPrice || (product?.discounts && product.discounts[0]) || null
        : discount;

    const introPriceString = !isDiscountSale
        ? product?.introPrice?.priceString || (product?.discounts && product.discounts[0]?.priceString) || null
        : discount?.priceString ?? null;

    const introPrice = introSource?.price ?? 0;
    const unitsPerCycle = introSource?.periodNumberOfUnits != null ? introSource.periodNumberOfUnits : 0;
    const cycles = introSource?.cycles != null ? introSource.cycles : 0;

    let introPricePeriodUnit = introSource?.periodUnit ?? null;
    if (introPricePeriodUnit != null) {
        introPricePeriodUnit = String(introPricePeriodUnit).toUpperCase();
    }

    // No usable intro data
    if (!introPriceString || !unitsPerCycle || !cycles || !introPricePeriodUnit) {
        return {
            discountIntroPriceString: introPriceString,
            introPriceCycle: cycles || null,
            periodNumberOfUnits: unitsPerCycle || null,
            introPricePeriodUnit,
            numberOfTotalIntroMonths: null,
            numberOfTotalIntroMonthsUnit: null,
            introPeriod: null,
        };
    }

    // Total length of the intro in the product’s unit
    const totalUnits = unitsPerCycle * cycles;

    const unitSingular = (() => {
        switch (introPricePeriodUnit) {
            case 'DAY':
                return 'day';
            case 'WEEK':
                return 'week';
            case 'MONTH':
                return 'month';
            case 'YEAR':
                return 'year';
            default:
                return introPricePeriodUnit.toLowerCase();
        }
    })();

    const unitPlural = `${unitSingular}s`;
    const totalUnitLabel = totalUnits === 1 ? unitSingular : unitPlural;

    const additionalInfo = {
        discountIntroPriceString: introPriceString,
        introPriceCycle: cycles,
        periodNumberOfUnits: unitsPerCycle,
        introPricePeriodUnit, // still the raw unit code (WEEK / MONTH / YEAR)
        // keep field names for compatibility, but they now use the real unit
        numberOfTotalIntroMonths: totalUnits,
        numberOfTotalIntroMonthsUnit: totalUnitLabel,
    };

    let introPeriod;

    if (introPrice === 0) {
        // Free trial
        introPeriod = `Free trial for ${totalUnits} ${totalUnitLabel}`;
    } else {
        // Paid intro (e.g. $X every 3 months for 6 months total)
        const perCycleLabel = unitsPerCycle === 1 ? unitSingular : unitPlural;

        introPeriod = `${introPriceString} every ${
            unitsPerCycle > 1 ? `${unitsPerCycle} ` : ''
        }${perCycleLabel} for ${totalUnits} ${totalUnitLabel}`;
    }

    return {
        ...additionalInfo,
        introPeriod,
    };
}
