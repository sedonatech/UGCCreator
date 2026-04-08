import { isAndroid } from '../src/Utils/Platform';
import {
    REVENUECAT_ANDROID_KEY,
    REVENUECAT_IOS_KEY,
    FIREBASE_SERVER_KEY,
    STREAM_API_KEY,
    STREAM_API_SECRET,
    STREAM_APP_ID,
    FACEBOOK_APP_ID,
    MAIN_DOMAIN,
    APPLE_APP_ID,
    GOOGLE_PACKAGE_NAME,
} from '@env';

const overrideEntitlements = false;

const overrideSubscription = __DEV__;

const overrideProfileUpdateModal = true;
const revenueCat = isAndroid ? REVENUECAT_ANDROID_KEY : REVENUECAT_IOS_KEY;
const firebaseServerKey = FIREBASE_SERVER_KEY;

const mainDomain = MAIN_DOMAIN;

const stream = {
    apiKey: STREAM_API_KEY,
    apiSecret: STREAM_API_SECRET,
    appId: Number(STREAM_APP_ID),
};

const reviewPromptProps = {
    AppleAppId: APPLE_APP_ID,
    GooglePackageName: GOOGLE_PACKAGE_NAME,
    link: mainDomain,
};

const fbAppID = FACEBOOK_APP_ID;

export default {
    overrideEntitlements,
    overrideSubscription,
    overrideProfileUpdateModal,
    revenueCat,
    stream,
    firebaseServerKey,
    mainDomain,
    reviewPromptProps,
    fbAppID,
};
