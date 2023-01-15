import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ADMIN_PANEL} from '../ScreenNames';
import {
  SWITCH,
  TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import AdminPanelScreen from '../../screens/brands/admin/AdminPanelScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const AdminPanelStack = () => (
  <Navigator initialRouteName={ADMIN_PANEL} screenOptions={SWITCH}>
    <Screen
      name={ADMIN_PANEL}
      options={TRANSPARENT_HEADER}
      component={AdminPanelScreen}
    />
  </Navigator>
);

export default AdminPanelStack;
