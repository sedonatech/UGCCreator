import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import {
    BRAND_DETAILS, CURRENT_PROJECT_DETAILS, HOME, PROJECT_DETAILS, RECOMMENDED_BRANDS, UGCAI, UPDATE_PORTFOLIO, WEBVIEW,
} from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';
import BrandDetailsScreen from '../../screens/app/explore/BrandDetailsScreen';
import ProjectDetailsScreen from '../../screens/app/explore/ProjectDetailsScreen';
import CurrentProjectDetailsScreen from '../../screens/app/offers/CurrentProjectDetailsScreen';
import UpdatePortfolioScreen from '../../screens/app/profile/UpdatePortfolioScreen';
import RecommendedBrandsScreen from '../../screens/app/home/RecommendedBrandsScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import UGCAiScreen from '../../screens/app/profile/UGCAiScreen';

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
        <Screen
            name={UPDATE_PORTFOLIO}
            options={TRANSPARENT_HEADER}
            component={UpdatePortfolioScreen}
        />
        <Screen
            name={RECOMMENDED_BRANDS}
            options={TRANSPARENT_HEADER}
            component={RecommendedBrandsScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
        <Screen
            name={UGCAI}
            options={TRANSPARENT_HEADER}
            component={UGCAiScreen}
        />
    </Navigator>
);

export default HomeStack;
