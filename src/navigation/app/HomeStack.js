import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import {
    BRAND_DETAILS, CURRENT_PROJECT_DETAILS, HOME, PROJECT_DETAILS,
} from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';
import BrandDetailsScreen from '../../screens/app/explore/BrandDetailsScreen';
import ProjectDetailsScreen from '../../screens/app/explore/ProjectDetailsScreen';
import CurrentProjectDetailsScreen from '../../screens/app/offers/CurrentProjectDetailsScreen';

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
        <Screen
            name={CURRENT_PROJECT_DETAILS}
            options={TRANSPARENT_HEADER}
            component={CurrentProjectDetailsScreen}
        />
    </Navigator>
);

export default HomeStack;
