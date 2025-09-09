import { isAndroid } from '../src/Utils/Platform';

const overrideEntitlements = false;

const overrideSubscription = __DEV__;

const overrideProfileUpdateModal = true;
const revenueCat = isAndroid ? process.env.ANDROID_REVENUE_CAT_ID : process.env.IOS_REVENUE_CAT_ID;
const firebaseServerKey = process.env.FIREBASE_SERVER_KEY;

const mainDomain = process.env.MAIN_DOMAIN;

const stream = {
    apiKey: process.env.STREAM_API_KEY,
    apiSecret: process.env.STREAM_API_SECRET,
    appId: process.env.STREAM_APP_ID,
};

const reviewPromptProps = {
    AppleAppId: process.env.APPLE_APP_ID,
    GooglePackageName: process.env.GOOGLE_PACKAGE_NAME,
    link: mainDomain,
};

const fbAppID = process.env.FACE_BOOK_APP_ID;

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
