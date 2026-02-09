import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getLanguageInfo } from '../i18n';

/**
 * Custom hook for internationalization
 * Wraps react-i18next with additional utilities
 *
 * @returns {Object} Translation utilities
 */
export const useTranslation = () => {
    const { t, i18n } = useI18nextTranslation();

    return {
        /**
         * Translation function
         * @param {string} key - Translation key (e.g., 'common.actions.save')
         * @param {Object} options - Interpolation options
         * @returns {string} Translated string
         */
        t,

        /**
         * Current language code
         * @returns {string} Language code (e.g., 'en', 'de', 'fr')
         */
        language: getCurrentLanguage(),

        /**
         * Change application language
         * @param {string} languageCode - Language code to switch to
         * @returns {Promise<void>}
         */
        changeLanguage,

        /**
         * Get current language information
         * @returns {Object} Language info {code, name, nativeName, flag}
         */
        languageInfo: getLanguageInfo(getCurrentLanguage()),

        /**
         * i18next instance for advanced usage
         */
        i18n,
    };
};

export default useTranslation;
