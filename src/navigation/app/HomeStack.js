import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {HOME} from '../ScreenNames';

import HomeScreen from '../../screens/app/home/HomeScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const HomeStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={HOME} component={HomeScreen} />
    </Navigator>
  );
};

export default HomeStack;
