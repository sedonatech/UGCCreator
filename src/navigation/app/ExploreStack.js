import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  SWITCH,
  TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/screenOptions';
import ExploreScreen from '../../screens/app/explore/ExploreScreen';
import {EXPLORE} from '../ScreenNames';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const ExploreStack = () => (
  <Navigator
    initialRouteName={EXPLORE}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={EXPLORE}
      options={TRANSPARENT_NO_LOGO_HEADER}
      component={ExploreScreen}
    />
  </Navigator>
);

export default ExploreStack;
