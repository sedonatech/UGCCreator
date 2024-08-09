import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import PortfolioScreen from '../../screens/app/profile/PortfolioScreen';
import {
    CREATOR_TOOLS_RESULTS,
    FORGOT_PASSWORD,
    PROFILE, RESULTS_HISTORY, SCRIPTS_GENERATOR,
    SETTINGS,
    UGCAI,
    UPDATE_PORTFOLIO,
    WEBVIEW,
} from '../ScreenNames';
import HeaderIconButton from '../../components/header/HeaderButton';
import SettingsScreen from '../../screens/app/profile/SettingsScreen';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import UpdatePortfolioScreen from '../../screens/app/profile/UpdatePortfolioScreen';
import ResetPasswordScreen from '../../screens/auth/ResetPasswordScreen';
import UGCAiScreen from '../../screens/app/profile/UGCAiScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import ScriptsGeneratorScreen from '../../screens/app/profile/ScriptsGeneratorScreen';
import CreatorToolsResultsScreen from '../../screens/app/profile/CreatorToolsResultsScreen';
import ResultsHistoryScreen from '../../screens/app/profile/ResultsHistoryScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ProfileStack = () => (
    <Navigator initialRouteName={PROFILE} 
        screenOptions={{
            ...SWITCH,
            lazy: true,
            freezeOnBlur: true,
            animationEnabled: false,
            gestureEnabled: false, 
            transitionSpec: {
                open: { animation: 'timing', config: { duration: 250 } },
                close: { animation: 'timing', config: { duration: 200 } },
            }
        }}
    >
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
            name={UGCAI}
            options={TRANSPARENT_HEADER}
            component={UGCAiScreen}
        />
        <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
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
    </Navigator>
);

export default ProfileStack;
