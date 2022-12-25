import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  EXPLORE_STACK,
  FEEDS_STACK,
  HOME_STACK,
  OFFERS_STACK,
  PROFILE_STACK,
} from '../ScreenNames';
import HomeStack from './HomeStack';
import ExploreStack from './ExploreStack';
import OffersStack from './OffersStack';
import FeedsStack from './FeedsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();
const {Navigator, Screen} = Tab;

const AppTabs = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name={HOME_STACK} component={HomeStack} />
      <Screen name={EXPLORE_STACK} component={ExploreStack} />
      <Screen name={OFFERS_STACK} component={OffersStack} />
      <Screen name={FEEDS_STACK} component={FeedsStack} />
      <Screen name={PROFILE_STACK} component={ProfileStack} />
    </Navigator>
  );
};

export default AppTabs;
