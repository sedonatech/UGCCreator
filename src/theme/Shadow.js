import {StyleSheet} from 'react-native';

import {isAndroid} from '../Utils/Platform';
import {BLACK_10, BLACK_50, WHITE} from './Colors';

export const ELEVATION = 3;
export const SHADOW_COLOR = BLACK_50;
export const SHADOW_OFFSET_WIDTH = 1;
export const SHADOW_OFFSET_HEIGHT = 3;
export const HIGHLIGHT_SHADOW_OFFSET_WIDTH = 0;
export const HIGHLIGHT_SHADOW_OFFSET_HEIGHT = 5;
export const SHADOW_RADIUS = 4;
export const HIGHLIGHT_SHADOW_RADIUS = 6;
export const SHADOW_OPACITY = 1;

export default StyleSheet.create({
  card: {
    backgroundColor: WHITE,
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
    backgroundColor: WHITE,
    shadowColor: isAndroid ? BLACK_50 : BLACK_10,
    shadowOffset: {
      width: SHADOW_OFFSET_WIDTH,
      height: SHADOW_OFFSET_HEIGHT,
    },
    shadowRadius: SHADOW_RADIUS,
    shadowOpacity: SHADOW_OPACITY,
    elevation: ELEVATION,
  },
  none: {
    backgroundColor: WHITE,
    shadowColor: null,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: WHITE,
    overflow: 'hidden',
  },
  flexWrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: WHITE,
    flex: 1,
    overflow: 'hidden',
  },
});
