import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import PortfolioScreen from '../../screens/app/profile/PortfolioScreen';
import { PROFILE, SETTINGS } from '../ScreenNames';
import HeaderIconButton from '../../components/header/HeaderButton';
import SettingsScreen from '../../screens/app/profile/SettingsScreen';
import { WRAPPER_MARGIN } from '../../theme/Layout';

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
    </Navigator>
);

export default ProfileStack;
