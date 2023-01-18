import React from 'react';
import {BLACK, LAVENDER, PRIMARY, WHITE} from '../../theme/Colors';
import Logo from '../../../asssets/svgs/Logo';
import TemplateText from '../TemplateText';
import {StyleSheet, View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/Layout';
import {isIOS} from '../../Utils/Platform';

export const TRANSPARENT_NO_LOGO_HEADER = {
  headerTitle: null,
  headerTransparent: true,
  headerBackTitleVisible: false,
  headerTintColor: WHITE,
  headerTitleAlign: 'center',
  headerBackground: null,
};

export const TRANSPARENT_HEADER = {
  headerTitle: () => (
    <TemplateText caps size={18} italic style={styles.title} color={BLACK}>
      UGC Creator
    </TemplateText>
  ),
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
