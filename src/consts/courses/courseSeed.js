import { getCurrentLanguage } from '../../i18n';

// Import language-specific course seeds
import { COURSE_SEED as COURSE_SEED_EN } from './courseSeed-en';
import { COURSE_SEED as COURSE_SEED_ES } from './courseSeed-es';
import { COURSE_SEED as COURSE_SEED_FR } from './courseSeed-fr';
import { COURSE_SEED as COURSE_SEED_DE } from './courseSeed-de';
import { COURSE_SEED as COURSE_SEED_PT_PT } from './courseSeed-pt-PT';
import { COURSE_SEED as COURSE_SEED_PT_BR } from './courseSeed-pt-BR';

const courseSeedMap = {
    en: COURSE_SEED_EN,
    es: COURSE_SEED_ES,
    fr: COURSE_SEED_FR,
    de: COURSE_SEED_DE,
    'pt-PT': COURSE_SEED_PT_PT,
    'pt-BR': COURSE_SEED_PT_BR,
};

/**
 * Get the course seed data for a specific language or the current language
 * @param {string} language - Optional language code (e.g., 'en', 'es', 'fr')
 * @returns {Array} Course seed data in the specified or current language
 */
export const getCourseSeed = (language = null) => {
    const targetLanguage = language || getCurrentLanguage();
    return courseSeedMap[targetLanguage] || COURSE_SEED_EN;
};

// Export the English version as default for backward compatibility
export const COURSE_SEED = COURSE_SEED_EN;
