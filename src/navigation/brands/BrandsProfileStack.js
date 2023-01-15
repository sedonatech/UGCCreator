import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {BRANDS_PROFILE} from '../ScreenNames';
import {SWITCH} from '../../components/header/ScreenOptions';
import BrandProfileScreen from '../../screens/brands/profile/BrandProfileScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const BrandsProfileStack = () => (
  <Navigator initialRouteName={BRANDS_PROFILE} screenOptions={SWITCH}>
    <Screen
      name={BRANDS_PROFILE}
      options={{headerShown: false}}
      component={BrandProfileScreen}
    />
  </Navigator>
);

export default BrandsProfileStack;
