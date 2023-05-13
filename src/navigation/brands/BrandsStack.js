import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BRANDS_TABS, SUBSCRIPTION } from '../ScreenNames';
import { SWITCH, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import BrandsTabs from './BrandsTabs';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const BrandsStack = () => (
    <Navigator initialRouteName={BRANDS_TABS} screenOptions={SWITCH}>
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
    </Navigator>
);

export default BrandsStack;
