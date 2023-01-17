import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {LOGIN, ONBOARDING, SIGN_UP, WELCOME} from '../ScreenNames';
import WelcomeScreen from '../../screens/onboarding/WelcomeScreen';
import OnboardingScreen from '../../screens/onboarding/OnboardingScreen';
import SignUpScreen from '../../screens/auth/SignUpScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import {TRANSPARENT_HEADER} from '../../components/header/ScreenOptions';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const AuthStack = () => {
  return (
    <Navigator
      initialRouteName={WELCOME}
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={WELCOME} component={WelcomeScreen} />
      <Screen
        name={ONBOARDING}
        component={OnboardingScreen}
        options={TRANSPARENT_HEADER}
      />
      <Screen name={SIGN_UP} component={SignUpScreen} />
      <Screen name={LOGIN} component={LoginScreen} />
    </Navigator>
  );
};

export default AuthStack;
