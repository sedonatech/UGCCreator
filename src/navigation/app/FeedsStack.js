import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SWITCH} from '../../components/header/ScreenOptions';
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
      options={{headerShown: false}}
      component={FeedsScreen}
    />
  </Navigator>
);

export default FeedsStack;
