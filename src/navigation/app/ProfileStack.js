import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH } from '../../components/header/ScreenOptions';
import ProfileScreen from '../../screens/app/profile/ProfileScreen';
import { PROFILE } from '../ScreenNames';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ProfileStack = () => (
    <Navigator initialRouteName={PROFILE} screenOptions={SWITCH}>
        <Screen
            name={PROFILE}
            options={{ headerShown: false }}
            component={ProfileScreen}
        />
    </Navigator>
);

export default ProfileStack;
