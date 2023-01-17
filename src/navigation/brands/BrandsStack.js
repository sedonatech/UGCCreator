import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {BRANDS_TABS} from '../ScreenNames';
import {SWITCH} from '../../components/header/ScreenOptions';
import BrandsTabs from './BrandsTabs';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const BrandsStack = () => (
  <Navigator initialRouteName={BRANDS_TABS} screenOptions={SWITCH}>
    <Screen
      name={BRANDS_TABS}
      options={{headerShown: false}}
      component={BrandsTabs}
    />
  </Navigator>
);

export default BrandsStack;
