import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
    ADMIN_PANEL_STACK,
    BRANDS_PROFILE_STACK, CHATS_STACK,
    CREATORS_PROFILES_STACK,
} from '../ScreenNames';
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';
import AdminPanelStack from './AdminPanelStack';
import CreatorsProfilesStack from './CreatorsProfilesStack';
import BrandsProfileStack from './BrandsProfileStack';
import ChatsStack from '../chats/ChatsStack';
import useNotificationPermissions from '../../hooks/notifications/useNotificationPermissions';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const BrandsTabs = () => {
    useNotificationPermissions();
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name={ADMIN_PANEL_STACK}
                component={AdminPanelStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="home-outline" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>Admin</TabLabel>,
                }}
            />
            <Screen
                name={CREATORS_PROFILES_STACK}
                component={CreatorsProfilesStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="search" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>Explore</TabLabel>,
                }}
            />
            <Screen
                name={CHATS_STACK}
                component={ChatsStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="chatbubbles-outline" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>Chats</TabLabel>,
                }}
            />
            <Screen
                name={BRANDS_PROFILE_STACK}
                component={BrandsProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="people-outline" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>Brand Profile</TabLabel>,
                }}
            />
        </Navigator>
    );
};

export default BrandsTabs;
