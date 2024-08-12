import { StyleSheet } from 'react-native';

import { isAndroid } from '../Utils/Platform';
import {
    BLACK_10, BLACK_50,
    BLACK_90,
} from './Colors';

export const ELEVATION = 9;
export const SHADOW_COLOR = BLACK_50;
export const SHADOW_OFFSET_WIDTH = 0;
export const SHADOW_OFFSET_HEIGHT = 2;
export const SHADOW_RADIUS = 5;
export const SHADOW_OPACITY = 0.5;

export const shadowStyle = StyleSheet.create({
    default: {
        shadowColor: SHADOW_COLOR,
        shadowOffset: {
            width: SHADOW_OFFSET_WIDTH,
            height: SHADOW_OFFSET_HEIGHT,
        },
        shadowRadius: SHADOW_RADIUS,
        shadowOpacity: SHADOW_OPACITY,
        elevation: ELEVATION,
    },
    card: {
        shadowColor: SHADOW_COLOR,
        shadowOffset: {
            width: SHADOW_OFFSET_WIDTH,
            height: SHADOW_OFFSET_HEIGHT,
        },
        shadowRadius: SHADOW_RADIUS,
        shadowOpacity: SHADOW_OPACITY,
        elevation: ELEVATION,
    },
    lightCard: {
        shadowColor: isAndroid ? BLACK_50 : BLACK_10,
        shadowOffset: {
            width: SHADOW_OFFSET_WIDTH,
            height: SHADOW_OFFSET_HEIGHT,
        },
        shadowRadius: SHADOW_RADIUS,
        shadowOpacity: SHADOW_OPACITY,
        elevation: ELEVATION,
    },
    mediumCard: {
        shadowColor: isAndroid ? BLACK_50 : BLACK_90,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 6,
        shadowOpacity: 0.15,
        elevation: 3,
    },
    none: {
        shadowColor: null,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
});

export const SHADOW = (type, backgroundColor, restProps) => {
    if (!backgroundColor || backgroundColor === 'transparent') return null;
    const style = shadowStyle[type || 'default'];
    return {
        ...style,
        backgroundColor,
        ...restProps,
    };
};
