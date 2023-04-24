import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CREATORS_PROFILES, PROFILE, WEBVIEW } from '../ScreenNames';
import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';

import CreatorProfilesScreen from '../../screens/brands/creators/CreatorProfilesScreen';

import PortfolioScreen from '../../screens/app/profile/PortfolioScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const CreatorsProfilesStack = () => (
    <Navigator initialRouteName={CREATORS_PROFILES} screenOptions={SWITCH}>
        <Screen
            name={CREATORS_PROFILES}
            options={TRANSPARENT_HEADER}
            component={CreatorProfilesScreen}
        />
        <Screen
            name={PROFILE}
            options={TRANSPARENT_HEADER}
            component={PortfolioScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
    </Navigator>
);

export default CreatorsProfilesStack;
