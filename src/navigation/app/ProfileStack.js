import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  SWITCH,
  TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/screenOptions';
import ProfileScreen from '../../screens/app/profile/ProfileScreen';
import {PROFILE} from '../ScreenNames';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const ProfileStack = () => (
  <Navigator
    initialRouteName={PROFILE}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={PROFILE}
      options={TRANSPARENT_NO_LOGO_HEADER}
      component={ProfileScreen}
    />
  </Navigator>
);

export default ProfileStack;
