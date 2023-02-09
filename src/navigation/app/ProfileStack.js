import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import ProfileScreen from '../../screens/app/profile/ProfileScreen';
import { PROFILE, SETTINGS } from '../ScreenNames';
import HeaderIconButton from '../../components/header/HeaderButton';
import SettingsScreen from '../../screens/app/profile/SettingsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ProfileStack = () => (
    <Navigator initialRouteName={PROFILE} screenOptions={SWITCH}>
        <Screen
            name={PROFILE}
            options={{
                ...TRANSPARENT_HEADER,
                headerRight: () => <HeaderIconButton name="settings-outline" screen={SETTINGS} />,
            }}
            component={ProfileScreen}
        />
        <Screen
            name={SETTINGS}
            options={TRANSPARENT_HEADER}
            component={SettingsScreen}
        />
    </Navigator>
);

export default ProfileStack;
