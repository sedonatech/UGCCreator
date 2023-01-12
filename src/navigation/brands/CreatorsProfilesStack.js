import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {CREATORS_PROFILES} from '../ScreenNames';
import {SWITCH} from '../../components/header/ScreenOptions';

import CreatorProfilesScreen from '../../screens/brands/creators/CreatorProfilesScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const CreatorsProfilesStack = () => (
  <Navigator initialRouteName={CREATORS_PROFILES} screenOptions={SWITCH}>
    <Screen
      name={CREATORS_PROFILES}
      options={{headerShown: false}}
      component={CreatorProfilesScreen}
    />
  </Navigator>
);

export default CreatorsProfilesStack;
