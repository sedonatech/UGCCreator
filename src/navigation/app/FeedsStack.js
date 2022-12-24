import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  SWITCH,
  TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/screenOptions';
import FeedsScreen from '../../screens/app/feeds/FeedsScreen';
import {FEEDS} from '../ScreenNames';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const FeedsStack = () => (
  <Navigator
    initialRouteName={FEEDS}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={FEEDS}
      options={TRANSPARENT_NO_LOGO_HEADER}
      component={FeedsScreen}
    />
  </Navigator>
);

export default FeedsStack;
