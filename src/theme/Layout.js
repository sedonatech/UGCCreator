import {Dimensions} from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const RADIUS_SMALL = 6;

export const RADIUS_MEDIUM = 12;

export const RADIUS_LARGE = 24;

export const isShortDEvice = SCREEN_HEIGHT < 700;

export const isSmallDevice = SCREEN_WIDTH < 350;
