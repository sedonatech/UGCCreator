import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ExploreScreen from '../../screens/app/explore/ExploreScreen';
import {EXPLORE} from '../ScreenNames';
import {SWITCH} from '../../components/header/ScreenOptions';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const ExploreStack = () => (
  <Navigator
    initialRouteName={EXPLORE}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={EXPLORE}
      options={{headerShown: false}}
      component={ExploreScreen}
    />
  </Navigator>
);

export default ExploreStack;
