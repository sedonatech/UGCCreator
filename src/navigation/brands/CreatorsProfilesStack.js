import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    CHATS_STACK, CREATORS_PROFILES, PROFILE, WEBVIEW,
} from '../ScreenNames';
import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';

import CreatorProfilesScreen from '../../screens/brands/creators/CreatorProfilesScreen';

import PortfolioScreen from '../../screens/app/profile/PortfolioScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import ChatsStack from '../chats/ChatsStack';
import useAuthContext from '../../hooks/auth/useAuthContext';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const CreatorsProfilesStack = () => {
    const { auth } = useAuthContext();
    const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';

    return (
        <Navigator
            initialRouteName={CREATORS_PROFILES}
            screenOptions={{
                headerShown: !isCreator,
                ...SWITCH,
                animation: 'none',
                animationEnabled: false,
            }}
        >
            <Screen
                name={CREATORS_PROFILES}
                options={{ ...TRANSPARENT_HEADER, animation: 'none' }}
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
};

export default CreatorsProfilesStack;
