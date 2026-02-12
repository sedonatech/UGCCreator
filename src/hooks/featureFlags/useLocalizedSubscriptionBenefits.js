import { useMemo } from 'react';
import useTranslation from '../useTranslation';
import { getSubscriptionBenefits } from '../../../config/defaultFeatures';

/**
 * Hook to get localized subscription benefits based on current language
 * Always returns the correct translation for the user's selected language
 */
const useLocalizedSubscriptionBenefits = () => {
    const { language } = useTranslation();

    const localizedBenefits = useMemo(() => {
        // Get localized subscription benefits based on current language
        return getSubscriptionBenefits(language);
    }, [language]);

    return localizedBenefits;
};

export default useLocalizedSubscriptionBenefits;
