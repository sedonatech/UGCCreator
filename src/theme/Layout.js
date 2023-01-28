import {Dimensions} from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const RADIUS_SMALL = 6;

export const RADIUS_MEDIUM = 12;

export const RADIUS_LARGE = 24;

export const isShortDEvice = SCREEN_HEIGHT < 700;

export const isSmallDevice = SCREEN_WIDTH < 350;

export const WRAPPER_MARGIN = 16;

export const SPACE_LARGE = 20;

export const WRAPPED_SCREEN_WIDTH = SCREEN_WIDTH - 2 * WRAPPER_MARGIN;

export const CATEGORY_CARD_HEIGHT = isShortDEvice
  ? SCREEN_HEIGHT / 8
  : SCREEN_HEIGHT / 8;

export const CATEGORY_CARD_WIDTH = isSmallDevice
  ? SCREEN_WIDTH / 4
  : SCREEN_WIDTH / 4;

export const OFFER_CARD_HEIGHT = isShortDEvice
  ? SCREEN_HEIGHT / 3.5
  : SCREEN_HEIGHT / 3.5;

export const OFFER_CARD_WIDTH = isSmallDevice
  ? SCREEN_WIDTH / 2.2
  : SCREEN_WIDTH / 2.2;
