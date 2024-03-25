import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { APP_TABS, SUBSCRIPTION } from '../ScreenNames';
import AppTabs from './AppTabs';
import { SWITCH, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const AppStack = () => (
    <Navigator
        initialRouteName={APP_TABS}
        screenOptions={{
            ...SWITCH,
            freezeOnBlur: true,
        }}
    >
        <Screen
            name={APP_TABS}
            options={{ headerShown: false }}
            component={AppTabs}
        />
        <Screen
            name={SUBSCRIPTION}
            component={SubscriptionScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
    </Navigator>
);

export default AppStack;
