import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { APP_TABS, CREATORS_PROFILES_STACK, SUBSCRIPTION } from '../ScreenNames';
import AppTabs from './AppTabs';
import { SWITCH, TRANSPARENT_HEADER, TRANSPARENT_HEADER_NO_LOGO, TRANSPARENT_NO_LOGO_HEADER } from '../../components/header/ScreenOptions';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';
import CreatorsProfilesStack from '../brands/CreatorsProfilesStack';

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
        <Screen
            name={CREATORS_PROFILES_STACK}
            component={CreatorsProfilesStack}
            options={TRANSPARENT_HEADER}
        />
    </Navigator>
);

export default AppStack;
