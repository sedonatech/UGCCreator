import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import {
    AFFILIATE_BRANDS,
    BRAND_APPLICATIONS,
    BRAND_DEALS_SCREEN,
    BRAND_DETAILS,
    BRAND_OFFERS,
    BRANDS_CATALOGUE,
    BRANDS_SCREEN,
    CHALLENGE_DETAILS,
    CHAT_ROOM,
    CREATOR_TOOLS_RESULTS,
    CURRENT_PROJECT_DETAILS,
    FEED_DETAILS,
    HOME,
    PLATFORM_BRANDS_SCREEN,
    PROJECT_DETAILS,
    PROJECTS_SCREEN,
    CONTENT_SUGGESTOR,
    HOOKS_GENERATOR,
    RESULTS_HISTORY,
    SCRIPTS_GENERATOR,
    UGCAI,
    UPDATE_PORTFOLIO,
    WEBVIEW,
} from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';
import BrandDetailsScreen from '../../screens/app/explore/BrandDetailsScreen';
import ProjectDetailsScreen from '../../screens/app/explore/ProjectDetailsScreen';
import CurrentProjectDetailsScreen from '../../screens/app/offers/CurrentProjectDetailsScreen';
import UpdatePortfolioScreen from '../../screens/app/profile/UpdatePortfolioScreen';
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
import BrandApplicationsScreen from '../../screens/app/home/BrandApplicationsScreen';
import BrandDealsScreen from '../../screens/app/home/BrandDealsScreen';
import ChallengeDetailsScreen from '../../screens/app/home/ChallengeDetailsScreen';
import BrandOffersScreen from '../../screens/brands/admin/BrandOffersScreen';
import PlatformBrandsScreen from '../../screens/app/home/PlatformBrandsScreen';
import ChatsStack from '../chats/ChatsStack';

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
            },
        }}
    >
        <Screen options={TRANSPARENT_HEADER} name={HOME} component={HomeScreen} />
        <Screen name={BRAND_DETAILS} options={TRANSPARENT_HEADER} component={BrandDetailsScreen} />
        <Screen name={PROJECT_DETAILS} options={TRANSPARENT_HEADER} component={ProjectDetailsScreen} />
        <Screen name={CURRENT_PROJECT_DETAILS} options={TRANSPARENT_HEADER} component={CurrentProjectDetailsScreen} />
        <Screen name={UPDATE_PORTFOLIO} options={TRANSPARENT_HEADER} component={UpdatePortfolioScreen} />
        <Screen name={WEBVIEW} options={TRANSPARENT_HEADER} component={WebviewScreen} />
        <Screen name={UGCAI} options={TRANSPARENT_HEADER} component={UGCAiScreen} />
        <Screen name={SCRIPTS_GENERATOR} options={TRANSPARENT_HEADER} component={ScriptsGeneratorScreen} />
        <Screen name={CONTENT_SUGGESTOR} options={TRANSPARENT_HEADER} component={ScriptsGeneratorScreen} />
        <Screen name={HOOKS_GENERATOR} options={TRANSPARENT_HEADER} component={ScriptsGeneratorScreen} />
        <Screen name={CREATOR_TOOLS_RESULTS} options={TRANSPARENT_HEADER} component={CreatorToolsResultsScreen} />
        <Screen name={RESULTS_HISTORY} options={TRANSPARENT_HEADER} component={ResultsHistoryScreen} />
        <Screen name={BRANDS_CATALOGUE} options={TRANSPARENT_HEADER} component={BrandsCatalogueScreen} />
        <Screen name={FEED_DETAILS} options={TRANSPARENT_HEADER} component={FeedDetailsScreen} />
        <Screen name={BRANDS_SCREEN} options={TRANSPARENT_HEADER} component={BrandsScreen} />
        <Screen name={PROJECTS_SCREEN} options={TRANSPARENT_HEADER} component={ProjectsScreen} />
        <Screen name={AFFILIATE_BRANDS} options={TRANSPARENT_HEADER} component={AffiliateBrandsScreen} />
        <Screen name={BRAND_APPLICATIONS} options={TRANSPARENT_HEADER} component={BrandApplicationsScreen} />
        <Screen name={BRAND_DEALS_SCREEN} options={TRANSPARENT_HEADER} component={BrandDealsScreen} />
        <Screen name={CHALLENGE_DETAILS} options={{ ...TRANSPARENT_HEADER, animationEnabled: false }} component={ChallengeDetailsScreen} />
        <Screen name={BRAND_OFFERS} options={TRANSPARENT_HEADER} component={BrandOffersScreen} />
        <Screen name={PLATFORM_BRANDS_SCREEN} options={TRANSPARENT_HEADER} component={PlatformBrandsScreen} />
        <Screen name={CHAT_ROOM} options={{ headerShown: false }} component={ChatsStack} />
    </Navigator>
);

export default HomeStack;
