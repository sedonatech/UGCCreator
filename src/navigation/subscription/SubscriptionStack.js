import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  SWITCH,
  TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/screenOptions';
import SubscriptionScreen from '../../screens/subscription/SubscriptionScreen';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const SubscriptionStack = () => (
  <Navigator
    initialRouteName="Subscription"
    headerMode="screen"
    screenOptions={SWITCH}>
    <Screen
      name="Subscription"
      options={TRANSPARENT_NO_LOGO_HEADER}
      component={SubscriptionScreen}
    />
  </Navigator>
);

export default SubscriptionStack;
