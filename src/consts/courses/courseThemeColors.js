/**
 * Shared course theme colors — imported by all locale-specific seed files.
 * Change colors here and all locales update automatically.
 */
import {
    INDIGO_600,
    INDIGO_50,
    EMERALD_50,
    VIOLET_50,
    PINK_50,
    WHITE,
} from '../../theme/Colors';

export const COURSE_THEME_1 = {
    accent: INDIGO_600,
    gradient: [INDIGO_50, WHITE, INDIGO_50],
};

export const COURSE_THEME_2 = {
    accent: '#0F766E',
    gradient: [EMERALD_50, WHITE, '#ECFEFF'],
};

export const COURSE_THEME_3 = {
    accent: '#9333EA',
    gradient: [VIOLET_50, WHITE, PINK_50],
};
