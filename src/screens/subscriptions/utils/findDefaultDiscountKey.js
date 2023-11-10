import { SUBSCRIPTION_IOS_DISCOUNT_YEARLY, SUBSCRIPTION_IOS_DISCOUNT_QUARTERLY, SUBSCRIPTION_IOS_DISCOUNT_MONTHLY } from '../consts';

export default (product) => {
    if (!product) {
        return null;
    }

    if (
        (typeof product?.title === 'string' && product?.title?.toLowerCase().includes('monthly'))
        || (typeof product?.identifier === 'string' && toLower(product?.identifier).includes('monthly'))
    ) {
        return SUBSCRIPTION_IOS_DISCOUNT_MONTHLY;
    }

    if (
        (typeof product?.title === 'string' && toLower(product?.title).includes('annual'))
        || (typeof product?.identifier === 'string' && toLower(product?.identifier).includes('annual'))
    ) {
        return SUBSCRIPTION_IOS_DISCOUNT_YEARLY;
    }

    if (
        (typeof product?.title === 'string' && toLower(product?.title).includes('quarterly'))
        || (typeof product?.identifier === 'string' && toLower(product?.identifier).includes('quarterly'))
    ) {
        return SUBSCRIPTION_IOS_DISCOUNT_QUARTERLY;
    }

    return null;
};
