import feed from './defaults/feed.json';
import features from './defaults/features.json';
import recommendedBrands from './defaults/recommendedBrands.json';
import recommendedCreators from './defaults/recommendedCreators.json';
import onboardingEducation from './defaults/onboardingEducation.json';
import subscriptionBenefits from './defaults/subscriptionBenefits.json';
import subscriptionBenefitsEs from './defaults/subscriptionBenefits.es.json';
import subscriptionBenefitsFr from './defaults/subscriptionBenefits.fr.json';
import subscriptionBenefitsDe from './defaults/subscriptionBenefits.de.json';
import subscriptionBenefitsPtBR from './defaults/subscriptionBenefits.pt-BR.json';
import subscriptionBenefitsPtPT from './defaults/subscriptionBenefits.pt-PT.json';
import androidSubscription from './defaults/androidSubscription.json';
import support from './defaults/support.json';
import testers from './defaults/testers.json';
import ugcGigs from './defaults/ugcGigs.json';
import platformBrands from './defaults/platformBrands.json';

// Map of subscription benefits by language
export const subscriptionBenefitsMap = {
    en: subscriptionBenefits,
    es: subscriptionBenefitsEs,
    fr: subscriptionBenefitsFr,
    de: subscriptionBenefitsDe,
    'pt-BR': subscriptionBenefitsPtBR,
    'pt-PT': subscriptionBenefitsPtPT,
};

const resolveSubscriptionBenefitsLanguage = (language = 'en') => {
    if (subscriptionBenefitsMap[language]) return language;

    const normalized = (language || 'en').replace('_', '-');
    if (subscriptionBenefitsMap[normalized]) return normalized;

    const baseLanguage = normalized.split('-')[0];
    if (baseLanguage === 'pt') return 'pt-BR';
    if (subscriptionBenefitsMap[baseLanguage]) return baseLanguage;

    return 'en';
};

// Function to get subscription benefits for a specific language
export const getSubscriptionBenefits = (language = 'en') => {
    const targetLanguage = resolveSubscriptionBenefitsLanguage(language);
    return subscriptionBenefitsMap[targetLanguage] || subscriptionBenefits;
};

export default {
    feed,
    features,
    recommendedBrands,
    ugcGigs,
    recommendedCreators,
    onboardingEducation,
    subscriptionBenefits,
    androidSubscription,
    support,
    testers,
    platformBrands,
};
