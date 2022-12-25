import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SWITCH} from '../../components/header/ScreenOptions';
import {HOME} from '../ScreenNames';
import HomeScreen from '../../screens/app/home/HomeScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const HomeStack = () => {
  return (
    <Navigator screenOptions={SWITCH}>
      <Screen
        options={{headerShown: false}}
        name={HOME}
        component={HomeScreen}
      />
    </Navigator>
  );
};

export default HomeStack;
