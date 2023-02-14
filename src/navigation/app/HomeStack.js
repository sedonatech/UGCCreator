import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import { BRAND_DETAILS, HOME, PROJECT_DETAILS } from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';
import BrandDetailsScreen from '../../screens/app/explore/BrandDetailsScreen';
import ProjectDetailsScreen from '../../screens/app/explore/ProjectDetailsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const HomeStack = () => (
    <Navigator screenOptions={SWITCH}>
        <Screen
            options={TRANSPARENT_HEADER}
            name={HOME}
            component={HomeScreen}
        />
        <Screen
            name={BRAND_DETAILS}
            options={TRANSPARENT_HEADER}
            component={BrandDetailsScreen}
        />
        <Screen
            name={PROJECT_DETAILS}
            options={TRANSPARENT_HEADER}
            component={ProjectDetailsScreen}
        />
    </Navigator>
);

export default HomeStack;
