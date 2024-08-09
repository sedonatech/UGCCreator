import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import {
    AFFILIATE_BRANDS,
    BRAND_DETAILS, BRANDS_CATALOGUE, BRANDS_SCREEN,
    CREATOR_TOOLS_RESULTS,
    CURRENT_PROJECT_DETAILS, FEED_DETAILS,
    HOME,
    PROJECT_DETAILS, PROJECTS_SCREEN,
    RECOMMENDED_BRANDS, RESULTS_HISTORY, SCRIPTS_GENERATOR,
    UGCAI,
    UPDATE_PORTFOLIO,
    WEBVIEW,
} from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';
import BrandDetailsScreen from '../../screens/app/explore/BrandDetailsScreen';
import ProjectDetailsScreen from '../../screens/app/explore/ProjectDetailsScreen';
import CurrentProjectDetailsScreen from '../../screens/app/offers/CurrentProjectDetailsScreen';
import UpdatePortfolioScreen from '../../screens/app/profile/UpdatePortfolioScreen';
import RecommendedBrandsScreen from '../../screens/app/home/RecommendedBrandsScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import UGCAiScreen from '../../screens/app/profile/UGCAiScreen';
import ScriptsGeneratorScreen from '../../screens/app/profile/ScriptsGeneratorScreen';
import CreatorToolsResultsScreen from '../../screens/app/profile/CreatorToolsResultsScreen';
import ResultsHistoryScreen from '../../screens/app/profile/ResultsHistoryScreen';
import BrandsCatalogueScreen from '../../screens/app/home/BrandsCatalogueScreen';
import FeedDetailsScreen from '../../screens/app/explore/FeedDetailsScreen';
import BrandsScreen from '../../screens/app/home/BrandsScreen';
import ProjectsScreen from '../../screens/app/home/ProjectsScreen';
import AffiliateBrandsScreen from '../../screens/app/home/AffiliateBrandsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const HomeStack = () => (
    <Navigator 
        screenOptions={{
            ...SWITCH,
            lazy: true,
            freezeOnBlur: true,
            animationEnabled: false,
            gestureEnabled: false, 
            transitionSpec: {
                open: { animation: 'timing', config: { duration: 150 } },
                close: { animation: 'timing', config: { duration: 200 } },
            }
        }}
    >
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
        <Screen
            name={SCRIPTS_GENERATOR}
            options={TRANSPARENT_HEADER}
            component={ScriptsGeneratorScreen}
        />
        <Screen
            name={CREATOR_TOOLS_RESULTS}
            options={TRANSPARENT_HEADER}
            component={CreatorToolsResultsScreen}
        />
        <Screen
            name={RESULTS_HISTORY}
            options={TRANSPARENT_HEADER}
            component={ResultsHistoryScreen}
        />
        <Screen
            name={BRANDS_CATALOGUE}
            options={TRANSPARENT_HEADER}
            component={BrandsCatalogueScreen}
        />
        <Screen
            name={FEED_DETAILS}
            options={TRANSPARENT_HEADER}
            component={FeedDetailsScreen}
        />
        <Screen
            name={BRANDS_SCREEN}
            options={TRANSPARENT_HEADER}
            component={BrandsScreen}
        />
        <Screen
            name={PROJECTS_SCREEN}
            options={TRANSPARENT_HEADER}
            component={ProjectsScreen}
        />
        <Screen
            name={AFFILIATE_BRANDS}
            options={TRANSPARENT_HEADER}
            component={AffiliateBrandsScreen}
        />
    </Navigator>
);

export default HomeStack;
