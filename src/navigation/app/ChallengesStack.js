import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import { CHALLENGES, CURRENT_PROJECT_DETAILS } from '../ScreenNames';
import CurrentProjectDetailsScreen from '../../screens/app/offers/CurrentProjectDetailsScreen';
import ChallengesScreen from '../../screens/app/offers/ChallengesScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ChallengesStack = () => (
    <Navigator initialRouteName={CHALLENGES} screenOptions={SWITCH}>
        <Screen name={CHALLENGES} options={TRANSPARENT_HEADER} component={ChallengesScreen} />
        <Screen name={CURRENT_PROJECT_DETAILS} options={TRANSPARENT_HEADER} component={CurrentProjectDetailsScreen} />
    </Navigator>
);

export default ChallengesStack;
