import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {APP_TABS} from '../ScreenNames';
import AppTabs from './AppTabs';
import {SWITCH} from '../../components/header/ScreenOptions';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const AppStack = () => (
  <Navigator
    initialRouteName={APP_TABS}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={APP_TABS}
      options={{headerShown: false}}
      component={AppTabs}
    />
  </Navigator>
);

export default AppStack;
