import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {AUTH} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={AUTH} component={AuthStack} />
    </Navigator>
  );
};

export default MainNavigator;
