import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import { HOME } from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const HomeStack = () => (
    <Navigator screenOptions={SWITCH}>
        <Screen options={TRANSPARENT_HEADER} name={HOME} component={HomeScreen} />
    </Navigator>
);

export default HomeStack;
