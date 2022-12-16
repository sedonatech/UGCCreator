import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import {ONBOARDING, WELCOME} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  return (
    <Navigator
      initialRouteName={WELCOME}
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={WELCOME} component={WelcomeScreen} />
      <Screen name={ONBOARDING} component={OnboardingScreen} />
    </Navigator>
  );
};

export default MainNavigator;
