import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  SWITCH,
  TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/screenOptions';
import {APP_TABS} from '../ScreenNames';
import AppTabs from './AppTabs';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const AppStack = () => (
  <Navigator
    initialRouteName={APP_TABS}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={APP_TABS}
      options={TRANSPARENT_NO_LOGO_HEADER}
      component={AppTabs}
    />
  </Navigator>
);

export default AppStack;
