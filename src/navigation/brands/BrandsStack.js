import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    ACTIVE_CREATORS, ADD_EVENT, BRAND_EVENT_DETAILS_SCREEN, BRAND_EVENTS_COMPLETED_SCREEN, BRAND_EVENTS_SCREEN, BRANDS_TABS, SUBSCRIPTION, UPDATE_BRAND_PROFILE, WEBVIEW,
} from '../ScreenNames';
import { SWITCH, TRANSPARENT_HEADER, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import BrandsTabs from './BrandsTabs';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';
import UpdateBrandProfileScreen from '../../screens/brands/profile/UpdateBrandProfileScreen';
import ActiveCreatorsScreen from '../../screens/brands/admin/ActiveCreatorsScreen';
import BrandEventsScreen from '../../screens/brands/events/BrandEventsScreen';
import BrandEventDetailsScreen from '../../screens/brands/events/BrandEventDetailsScreen';
import AddEventScreen from '../../screens/brands/events/AddEventScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import BrandEventsCompletedScreen from '../../screens/brands/events/BrandEventsCompletedScreen';
import { WHITE } from '../../theme/Colors';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const BrandsStack = () => (
    <Navigator
        initialRouteName={BRANDS_TABS}
        screenOptions={{
            ...SWITCH,
            cardStyle: {
                backgroundColor: WHITE,
            },
        }}
    >
        <Screen
            name={BRANDS_TABS}
            options={{ headerShown: false }}
            component={BrandsTabs}
        />
        <Screen
            name={SUBSCRIPTION}
            component={SubscriptionScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={UPDATE_BRAND_PROFILE}
            options={TRANSPARENT_HEADER}
            component={UpdateBrandProfileScreen}
        />
        <Screen
            name={ACTIVE_CREATORS}
            options={TRANSPARENT_HEADER}
            component={ActiveCreatorsScreen}
        />
        <Screen
            name={BRAND_EVENTS_SCREEN}
            options={TRANSPARENT_HEADER}
            component={BrandEventsScreen}
        />
        <Screen
            name={BRAND_EVENTS_COMPLETED_SCREEN}
            options={TRANSPARENT_HEADER}
            component={BrandEventsCompletedScreen}
        />
        <Screen
            name={BRAND_EVENT_DETAILS_SCREEN}
            options={TRANSPARENT_HEADER}
            component={BrandEventDetailsScreen}
        />
        <Screen
            name={ADD_EVENT}
            options={TRANSPARENT_HEADER}
            component={AddEventScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
    </Navigator>
);

export default BrandsStack;
