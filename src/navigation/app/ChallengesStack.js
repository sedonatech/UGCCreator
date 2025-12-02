import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import { CHALLENGE_DETAILS, CHALLENGES } from '../ScreenNames';
import ChallengesScreen from '../../screens/app/offers/ChallengesScreen';
import ChallengeDetailsScreen from '../../screens/app/home/ChallengeDetailsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ChallengesStack = () => (
    <Navigator initialRouteName={CHALLENGES} screenOptions={SWITCH}>
        <Screen name={CHALLENGES} options={TRANSPARENT_HEADER} component={ChallengesScreen} />
        <Screen name={CHALLENGE_DETAILS} options={TRANSPARENT_HEADER} component={ChallengeDetailsScreen} />
    </Navigator>
);

export default ChallengesStack;
