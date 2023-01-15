import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  ADMIN_PANEL_STACK,
  BRANDS_PROFILE_STACK,
  CREATORS_PROFILES_STACK,
} from '../ScreenNames';
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';
import AdminPanelStack from './AdminPanelStack';
import CreatorsProfilesStack from './CreatorsProfilesStack';
import BrandsProfileStack from './BrandsProfileStack';

const Tab = createBottomTabNavigator();
const {Navigator, Screen} = Tab;

const BrandsTabs = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen
        name={ADMIN_PANEL_STACK}
        component={AdminPanelStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabButton focused={focused} icon="home-outline" />
          ),
          tabBarLabel: props => <TabLabel {...props}>Admin</TabLabel>,
        }}
      />
      <Screen
        name={CREATORS_PROFILES_STACK}
        component={CreatorsProfilesStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabButton focused={focused} icon="search" />
          ),
          tabBarLabel: props => <TabLabel {...props}>Explore</TabLabel>,
        }}
      />
      <Screen
        name={BRANDS_PROFILE_STACK}
        component={BrandsProfileStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabButton focused={focused} icon="library-outline" />
          ),
          tabBarLabel: props => <TabLabel {...props}>Profile</TabLabel>,
        }}
      />
    </Navigator>
  );
};

export default BrandsTabs;
