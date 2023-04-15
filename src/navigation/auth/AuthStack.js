import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    FORGOT_PASSWORD,
    LOGIN, ONBOARDING, ONBOARDING_EDUCATION, SIGN_UP, WELCOME,
} from '../ScreenNames';
import WelcomeScreen from '../../screens/onboarding/WelcomeScreen';
import OnboardingScreen from '../../screens/onboarding/OnboardingScreen';
import SignUpScreen from '../../screens/auth/SignUpScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import { SWITCH, TRANSPARENT_HEADER_NO_LOGO } from '../../components/header/ScreenOptions';
import ResetPasswordScreen from '../../screens/auth/ResetPasswordScreen';
import OnboardingEducationScreen from '../../screens/onboarding/OnboardingEducationScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const AuthStack = () => (
    <Navigator
        initialRouteName={WELCOME}
        screenOptions={SWITCH}
    >
        <Screen
            name={WELCOME}
            component={WelcomeScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={ONBOARDING}
            component={OnboardingScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={ONBOARDING_EDUCATION}
            component={OnboardingEducationScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={SIGN_UP}
            component={SignUpScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={LOGIN}
            component={LoginScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={FORGOT_PASSWORD}
            component={ResetPasswordScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
    </Navigator>
);

export default AuthStack;
