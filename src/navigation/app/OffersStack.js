import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  SWITCH,
  TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/screenOptions';
import OffersScreen from '../../screens/app/offers/OffersScreen';
import {OFFERS} from '../ScreenNames';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const OffersStack = () => (
  <Navigator
    initialRouteName={OFFERS}
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name={OFFERS}
      options={TRANSPARENT_NO_LOGO_HEADER}
      component={OffersScreen}
    />
  </Navigator>
);

export default OffersStack;
