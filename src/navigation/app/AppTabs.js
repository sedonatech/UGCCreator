import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const AppTabs = () => (
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
        {/* <Screen */}
        {/*    name={OFFERS_STACK} */}
        {/*    component={OffersStack} */}
        {/*    options={{ */}
        {/*        tabBarIcon: ({ focused }) => ( */}
        {/*            <TabButton focused={focused} icon="briefcase" /> */}
        {/*        ), */}
        {/*        tabBarLabel: (props) => <TabLabel {...props}>My Offers</TabLabel>, */}
        {/*    }} */}
        {/* /> */}
        <Screen
            name={FEEDS_STACK}
            component={FeedsStack}
            options={{
                tabBarIcon: ({ focused }) => (
                    <TabButton focused={focused} icon="compass" />
                ),
                tabBarLabel: (props) => <TabLabel {...props}>Feeds</TabLabel>,
            }}
        />
        <Screen
            name={PROFILE_STACK}
            component={ProfileStack}
            options={{
                tabBarIcon: ({ focused }) => (
                    <TabButton focused={focused} icon="person" />
                ),
                tabBarLabel: (props) => <TabLabel {...props}>Portfolio</TabLabel>,
            }}
        />
    </Navigator>
);

export default AppTabs;
