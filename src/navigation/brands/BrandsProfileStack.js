import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    BRAND_SETTINGS,
    BRANDS_PROFILE, FORGOT_PASSWORD, UPDATE_BRAND_PROFILE, WEBVIEW,
} from '../ScreenNames';
import { SWITCH, TRANSPARENT_HEADER, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import BrandProfileScreen from '../../screens/brands/profile/BrandProfileScreen';
import UpdateBrandProfileScreen from '../../screens/brands/profile/UpdateBrandProfileScreen';
import ResetPasswordScreen from '../../screens/auth/ResetPasswordScreen';
import BrandSettingsScreen from '../../screens/brands/profile/BrandSettingsScreen';
import HeaderIconButton from '../../components/header/HeaderButton';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import WebviewScreen from '../../screens/webview/WebviewScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const BrandsProfileStack = () => (
    <Navigator initialRouteName={BRANDS_PROFILE} screenOptions={SWITCH}>
        <Screen
            name={BRANDS_PROFILE}
            options={{
                ...TRANSPARENT_HEADER,
                headerRight: () => (
                    <HeaderIconButton
                        name="settings-outline"
                        screen={BRAND_SETTINGS}
                        mr={WRAPPER_MARGIN}
                    />
                ),
            }}
            component={BrandProfileScreen}
        />
        <Screen
            name={UPDATE_BRAND_PROFILE}
            options={TRANSPARENT_HEADER}
            component={UpdateBrandProfileScreen}
        />
        <Screen
            name={FORGOT_PASSWORD}
            component={ResetPasswordScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={BRAND_SETTINGS}
            options={TRANSPARENT_HEADER}
            component={BrandSettingsScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
    </Navigator>
);

export default BrandsProfileStack;
