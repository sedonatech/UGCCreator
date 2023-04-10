import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import PortfolioScreen from '../../screens/app/profile/PortfolioScreen';
import {
    FORGOT_PASSWORD, PROFILE, SETTINGS, SUBSCRIPTION, UGCAI, UPDATE_PORTFOLIO,
} from '../ScreenNames';
import HeaderIconButton from '../../components/header/HeaderButton';
import SettingsScreen from '../../screens/app/profile/SettingsScreen';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import UpdatePortfolioScreen from '../../screens/app/profile/UpdatePortfolioScreen';
import ResetPasswordScreen from '../../screens/auth/ResetPasswordScreen';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';
import UGCAiScreen from '../../screens/app/profile/UGCAiScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ProfileStack = () => (
    <Navigator initialRouteName={PROFILE} screenOptions={SWITCH}>
        <Screen
            name={PROFILE}
            options={{
                ...TRANSPARENT_HEADER,
                headerRight: () => (
                    <HeaderIconButton
                        name="settings-outline"
                        screen={SETTINGS}
                        mr={WRAPPER_MARGIN}
                    />
                ),
            }}
            component={PortfolioScreen}
        />
        <Screen
            name={SETTINGS}
            options={TRANSPARENT_HEADER}
            component={SettingsScreen}
        />
        <Screen
            name={UPDATE_PORTFOLIO}
            options={TRANSPARENT_HEADER}
            component={UpdatePortfolioScreen}
        />
        <Screen
            name={FORGOT_PASSWORD}
            component={ResetPasswordScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={SUBSCRIPTION}
            component={SubscriptionScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={UGCAI}
            options={TRANSPARENT_HEADER}
            component={UGCAiScreen}
        />
    </Navigator>
);

export default ProfileStack;
