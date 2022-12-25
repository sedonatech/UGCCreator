import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SWITCH} from '../../components/header/ScreenOptions';
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
      options={{headerShown: false}}
      component={OffersScreen}
    />
  </Navigator>
);

export default OffersStack;
