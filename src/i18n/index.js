import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';

import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';
import ptPT from './locales/pt-PT.json';

const LANGUAGE_KEY = '@ugc_creator_language';

export const resources = {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    es: { translation: es },
    'pt-BR': { translation: ptBR },
    'pt-PT': { translation: ptPT },
};

export const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', flag: '🇵🇹' },
];

// Get device language
const getDeviceLanguage = () => {
    let deviceLanguage = 'en';

    if (Platform.OS === 'ios') {
        deviceLanguage =
            NativeModules.SettingsManager?.settings?.AppleLocale ||
            NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
            'en';
    } else if (Platform.OS === 'android') {
        deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
    }

    // Normalize language code (e.g., 'pt_BR' -> 'pt-BR', 'en_US' -> 'en')
    const normalized = deviceLanguage.replace('_', '-');

    // Check if we support this exact locale
    if (supportedLanguages.some(lang => lang.code === normalized)) {
        return normalized;
    }

    // Check if we support the base language (e.g., 'pt' from 'pt-BR')
    const baseLanguage = normalized.split('-')[0];
    const matchingLang = supportedLanguages.find(lang => lang.code.startsWith(baseLanguage));

    return matchingLang?.code || 'en';
};

// Storage operations
const getStoredLanguage = async () => {
    try {
        const language = await AsyncStorage.getItem(LANGUAGE_KEY);
        return language;
    } catch (error) {
        console.warn('Error reading saved language:', error);
        return null;
    }
};

export const setStoredLanguage = async language => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
        console.warn('Error saving language:', error);
    }
};

// Change language function
export const changeLanguage = async languageCode => {
    await i18n.changeLanguage(languageCode);
    await setStoredLanguage(languageCode);
};

// Get current language
export const getCurrentLanguage = () => i18n.language || 'en';

// Get supported language info
export const getLanguageInfo = languageCode => {
    return supportedLanguages.find(lang => lang.code === languageCode) || supportedLanguages[0];
};

// Initialize i18n immediately (synchronous initialization with async storage as fallback)
i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language, will be updated from storage
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

// Load saved language asynchronously after initialization
getStoredLanguage().then(savedLanguage => {
    if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
    } else if (!savedLanguage) {
        // If no saved language, use device language
        const deviceLang = getDeviceLanguage();
        if (deviceLang !== i18n.language) {
            i18n.changeLanguage(deviceLang);
        }
    }
});

export default i18n;
