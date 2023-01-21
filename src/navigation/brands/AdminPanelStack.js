import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ADD_PROJECT, ADMIN_PANEL} from '../ScreenNames';
import {
  SWITCH,
  TRANSPARENT_HEADER,
} from '../../components/header/ScreenOptions';
import AdminPanelScreen from '../../screens/brands/admin/AdminPanelScreen';
import AddProjectScreen from '../../screens/brands/admin/AddProjectScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const AdminPanelStack = () => (
  <Navigator initialRouteName={ADMIN_PANEL} screenOptions={SWITCH}>
    <Screen
      name={ADMIN_PANEL}
      options={TRANSPARENT_HEADER}
      component={AdminPanelScreen}
    />
    <Screen
      name={ADD_PROJECT}
      options={TRANSPARENT_HEADER}
      component={AddProjectScreen}
    />
  </Navigator>
);

export default AdminPanelStack;
