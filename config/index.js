import { isAndroid } from '../src/Utils/Platform';

const overrideEntitlements = false;

const overrideSubscription = __DEV__;

const overrideProfileUpdateModal = true;
const revenueCat = isAndroid ? 'goog_VloSDFYRLkZcXLeXTMxYfNiEtbu' : 'appl_gKgUgJLyYmYOxsOgRIltrYVOswb';
const firebaseServerKey = 'AAAA75Z1awc:APA91bGZlGphZsIZP4vSN3CZFrFCYPM4jv4D2tg0ynItNqSLKTP90lkcrveEC8S1lWX2GfGM2kg0mHAHXIMBbDHMrgmEWkIKDb9R2frYvI2zpUy1GbehQ8wo23WZzJ6OPSWriZFK94_i';

const mainDomain = 'https://www.ugccreatorapp.com/#Contact';

const stream = {
    apiKey: '3jymrhfzg4ah',
    apiSecret: 'c3vabn4y94fssbgc9fmj4rpp4479nz9dt7s52cn53ktj2yefxdsxfe6gxb4uunsp',
    appId: 1236778,
};

const reviewPromptProps = {
    AppleAppId: '6446017566',
    GooglePackageName: 'com.ugccreatorapp',
    link: mainDomain,
};

const fbAppID = '2996542933821709';

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
