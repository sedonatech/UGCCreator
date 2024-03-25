import { getStatusBarHeight } from 'react-native-status-bar-height';

import { Appearance, Dimensions, Platform } from 'react-native';
import { wp } from '../Utils/getResponsiveSize';

const deviceVersion = Platform.Version;
console.log('-> deviceVersion', deviceVersion);

const IS_IOS_16 = deviceVersion >= 16 && Platform.OS === 'ios';

export const IS_DARK:boolean = (Appearance.getColorScheme() === 'dark');

// Dimensions corresponding to iPhone 13, used in the designs

export const SCREEN_HEIGHT:number = Dimensions.get('screen').height;
export const SCREEN_WIDTH:number = Dimensions.get('screen').width;

export const WRAPPER_MARGIN = 20;
export const WRAPPED_SCREEN_WIDTH:number = SCREEN_WIDTH - wp(WRAPPER_MARGIN * 2);

export const IS_SMALL_DEVICE:boolean = SCREEN_WIDTH <= 375;
export const IS_SHORT_DEVICE:boolean = SCREEN_HEIGHT < 700;

export const STATUS_BAR_HEIGHT:number = getStatusBarHeight();

console.log('-> STATUS_BAR_HEIGHT', STATUS_BAR_HEIGHT);
console.log('-> SCREEN_HEIGHT', SCREEN_HEIGHT);
console.log('-> SCREEN_WIDTH', SCREEN_WIDTH);

export const IS_ANDROID:boolean = Platform.OS === 'android';

export const RADIUS_XSMALL = 5;
export const RADIUS_SMALL = 10;
export const RADIUS_MEDIUM = 15;
export const RADIUS_LARGE = 20;
export const RADIUS_XLARGE = 25;
export const RADIUS_XXLARGE = 30;

export const SPACE_XSMALL = 5;
export const SPACE_SMALL = 10;
export const SPACE_MEDIUM = 16;
export const SPACE_LARGE = 20;
export const SPACE_XLARGE = 25;
export const SPACE_XXLARGE = 35;

export const BORDER_XXSMALL = 0.4;
export const BORDER_XSMALL = 1;
export const BORDER_SMALL = 2;
export const BORDER_MEDIUM = 3;
export const BORDER_LARGE = 4;
export const BORDER_XLARGE = 5;
export const BORDER_XXLARGE = 6;

export const CATEGORY_CARD_HEIGHT = IS_SHORT_DEVICE
    ? SCREEN_HEIGHT / 8
    : SCREEN_HEIGHT / 8;

export const CATEGORY_CARD_WIDTH = IS_SMALL_DEVICE
    ? SCREEN_WIDTH / 4
    : SCREEN_WIDTH / 4;

export const OFFER_CARD_HEIGHT = IS_SMALL_DEVICE
    ? SCREEN_HEIGHT / 3.5
    : SCREEN_HEIGHT / 3.5;

export const OFFER_CARD_WIDTH = IS_SMALL_DEVICE
    ? SCREEN_WIDTH / 2.2
    : SCREEN_WIDTH / 2.2;

// eslint-disable-next-line no-nested-ternary
const HEADER_MARGIN_OFFSET = IS_ANDROID ? 2.2 : IS_IOS_16 ? 5 : 2.6;

export const HEADER_MARGIN = IS_ANDROID ? 80 : wp(136);
