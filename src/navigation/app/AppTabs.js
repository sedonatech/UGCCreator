import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    CHATS_STACK,
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
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';
import useNotificationPermissions from '../../hooks/notifications/useNotificationPermissions';
import ChatsStack from '../chats/ChatsStack';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const AppTabs = () => {
    useNotificationPermissions();

    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name={HOME_STACK}
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="home-outline" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>Home</TabLabel>,
                }}
            />
            <Screen
                name={EXPLORE_STACK}
                component={ExploreStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="search" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>Explore</TabLabel>,
                }}
            />
            <Screen
                name={OFFERS_STACK}
                component={OffersStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="briefcase" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>My Projects</TabLabel>,
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
                name={PROFILE_STACK}
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabButton focused={focused} icon="person" />
                    ),
                    tabBarLabel: (props) => <TabLabel {...props}>My Portfolio</TabLabel>,
                }}
            />
        </Navigator>
    );
};

export default AppTabs;
