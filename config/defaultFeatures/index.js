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

// Map of subscription benefits by language
export const subscriptionBenefitsMap = {
    en: subscriptionBenefits,
    es: subscriptionBenefitsEs,
    fr: subscriptionBenefitsFr,
    de: subscriptionBenefitsDe,
    'pt-BR': subscriptionBenefitsPtBR,
    'pt-PT': subscriptionBenefitsPtPT,
};

// Function to get subscription benefits for a specific language
export const getSubscriptionBenefits = (language = 'en') => {
    return subscriptionBenefitsMap[language] || subscriptionBenefits;
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
};
