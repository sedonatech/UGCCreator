import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ExploreScreen from '../../screens/app/explore/ExploreScreen';
import { EXPLORE } from '../ScreenNames';
import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ExploreStack = () => (
    <Navigator initialRouteName={EXPLORE} screenOptions={SWITCH}>
        <Screen
            name={EXPLORE}
            options={TRANSPARENT_HEADER}
            component={ExploreScreen}
        />
    </Navigator>
);

export default ExploreStack;
