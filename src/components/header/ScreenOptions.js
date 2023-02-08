import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BLACK, PRIMARY, WHITE } from '../../theme/Colors';

import TemplateText from '../TemplateText';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import { isIOS } from '../../Utils/Platform';
import BrandLogo from '../../../assets/svgs/BrandLogo';

export const TRANSPARENT_NO_LOGO_HEADER = {
    headerTitle: null,
    headerTransparent: true,
    headerBackTitleVisible: false,
    headerTintColor: WHITE,
    headerTitleAlign: 'center',
    headerBackground: null,
};

export const TRANSPARENT_HEADER = {
    headerTitle: () => <BrandLogo />,
    headerTransparent: true,
    headerBackTitleVisible: false,
    headerTintColor: PRIMARY,
    headerTitleAlign: 'center',
    headerBackground: () => <View style={styles.header} />,
    animationEnabled: true,
    headerMode: 'screen',
};
export const SWITCH = {
    animationEnabled: false,
};

const styles = StyleSheet.create({
    title: {
        fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
    },
    header: {
        height: SCREEN_HEIGHT * 0.1,
        width: SCREEN_WIDTH,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
