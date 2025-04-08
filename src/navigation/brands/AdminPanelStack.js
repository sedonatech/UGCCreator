import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    ACTIVE_CREATORS,
    ADD_EVENT,
    ADD_PROJECT,
    ADMIN_PANEL,
    BRAND_OFFERS,
    BRAND_PROJECT_DETAILS,
    BRAND_PROJECTS, BRANDS_PROFILE_STACK, CHAT_ROOM,
    CREATOR_PROJECT_STATUS, CREATORS_PROFILES, PROFILE,
    UPDATE_BRAND_PROFILE, WEBVIEW,
} from '../ScreenNames';
import {
    SWITCH,
    TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import AdminPanelScreen from '../../screens/brands/admin/AdminPanelScreen';
import AddProjectScreen from '../../screens/brands/admin/AddProjectScreen';
import BrandProjectsScreen from '../../screens/brands/admin/BrandProjectsScreen';
import BrandProjectDetailsScreen from '../../screens/brands/admin/BrandProjectDetailsScreen';
import UpdateBrandProfileScreen from '../../screens/brands/profile/UpdateBrandProfileScreen';
import CreatorProjectStatusScreen from '../../screens/brands/admin/CreatorProjectStatusScreen';
import BrandOffersScreen from '../../screens/brands/admin/BrandOffersScreen';
import PortfolioScreen from '../../screens/app/profile/PortfolioScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import CreatorProfilesScreen from '../../screens/brands/creators/CreatorProfilesScreen';
import ChatsStack from '../chats/ChatsStack';
import BrandsProfileStack from './BrandsProfileStack';
import ActiveCreatorsScreen from '../../screens/brands/admin/ActiveCreatorsScreen';
import { WHITE } from '../../theme/Colors';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const AdminPanelStack = () => (
    <Navigator
        initialRouteName={ADMIN_PANEL}
        screenOptions={{
            ...SWITCH,
            cardStyle: {
                backgroundColor: WHITE,
            },
        }}
    >
        <Screen
            name={ADMIN_PANEL}
            options={TRANSPARENT_HEADER}
            component={AdminPanelScreen}
        />
        <Screen
            name={ADD_PROJECT}
            options={TRANSPARENT_HEADER}
            component={AddProjectScreen}
        />
        <Screen
            name={BRAND_PROJECTS}
            options={TRANSPARENT_HEADER}
            component={BrandProjectsScreen}
        />
        <Screen
            name={BRAND_PROJECT_DETAILS}
            options={TRANSPARENT_HEADER}
            component={BrandProjectDetailsScreen}
        />
        <Screen
            name={UPDATE_BRAND_PROFILE}
            options={TRANSPARENT_HEADER}
            component={UpdateBrandProfileScreen}
        />
        <Screen
            name={CREATOR_PROJECT_STATUS}
            options={TRANSPARENT_HEADER}
            component={CreatorProjectStatusScreen}
        />
        <Screen
            name={BRAND_OFFERS}
            options={TRANSPARENT_HEADER}
            component={BrandOffersScreen}
        />
        <Screen
            name={PROFILE}
            options={TRANSPARENT_HEADER}
            component={PortfolioScreen}
        />
        <Screen
            name={CREATORS_PROFILES}
            options={TRANSPARENT_HEADER}
            component={CreatorProfilesScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
        <Screen
            name={CHAT_ROOM}
            options={TRANSPARENT_HEADER}
            component={ChatsStack}
        />
        {/* <Screen
            name={BRANDS_PROFILE_STACK}
            options={TRANSPARENT_HEADER}
            component={BrandsProfileStack}
        /> */}
    </Navigator>
);

export default AdminPanelStack;
