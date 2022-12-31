import React from 'react';
import {PRIMARY, WHITE} from '../../theme/Colors';
import Logo from '../../../asssets/svgs/Logo';

export const TRANSPARENT_NO_LOGO_HEADER = {
  headerTitle: null,
  headerTransparent: true,
  headerBackTitleVisible: false,
  headerTintColor: WHITE,
  headerTitleAlign: 'center',
  headerBackground: null,
};

export const TRANSPARENT_HEADER = {
  headerTitle: () => <Logo height={80} width={80} />,
  headerTransparent: true,
  headerBackTitleVisible: false,
  headerTintColor: PRIMARY,
  headerTitleAlign: 'center',
  headerBackground: null,
  animationEnabled: true,
};
export const SWITCH = {
  animationEnabled: false,
};
