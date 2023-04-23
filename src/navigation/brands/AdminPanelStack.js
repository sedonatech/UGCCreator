import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    ADD_PROJECT,
    ADMIN_PANEL,
    BRAND_OFFERS,
    BRAND_PROJECT_DETAILS,
    BRAND_PROJECTS,
    CREATOR_PROJECT_STATUS, PROFILE,
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

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const AdminPanelStack = () => (
    <Navigator initialRouteName={ADMIN_PANEL} screenOptions={SWITCH}>
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
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
    </Navigator>
);

export default AdminPanelStack;
