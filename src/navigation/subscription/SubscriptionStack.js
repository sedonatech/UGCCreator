import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    SWITCH,
    TRANSPARENT_HEADER,
    TRANSPARENT_HEADER_NO_LOGO,
} from '../../components/header/ScreenOptions';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';
import { SUBSCRIPTION, WEBVIEW } from '../ScreenNames';
import WebviewScreen from '../../screens/webview/WebviewScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const SubscriptionStack = () => (
    <Navigator initialRouteName={SUBSCRIPTION} screenOptions={SWITCH}>
        <Screen
            name={SUBSCRIPTION}
            options={TRANSPARENT_HEADER_NO_LOGO}
            component={SubscriptionScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
    </Navigator>
);

export default SubscriptionStack;
