import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import FeedsScreen from '../../screens/app/feeds/FeedsScreen';
import { FEEDS } from '../ScreenNames';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const FeedsStack = () => (
    <Navigator initialRouteName={FEEDS} screenOptions={SWITCH}>
        <Screen
            name={FEEDS}
            options={TRANSPARENT_HEADER}
            component={FeedsScreen}
        />
    </Navigator>
);

export default FeedsStack;
