import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SWITCH, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';
import { SUBSCRIPTION } from '../ScreenNames';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const SubscriptionStack = () => (
    <Navigator initialRouteName={SUBSCRIPTION} screenOptions={SWITCH}>
        <Screen
            name={SUBSCRIPTION}
            options={TRANSPARENT_HEADER_NO_LOGO}
            component={SubscriptionScreen}
        />
    </Navigator>
);

export default SubscriptionStack;
