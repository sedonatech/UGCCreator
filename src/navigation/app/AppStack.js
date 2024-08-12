import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { APP_TABS, CREATORS_PROFILES_STACK, EVENT_DETAILS_SCREEN, EVENTS_SCREEN, FAVORITE_EVENTS_SCREEN, SUBSCRIPTION, WEBVIEW } from '../ScreenNames';
import AppTabs from './AppTabs';
import { SWITCH, TRANSPARENT_HEADER, TRANSPARENT_HEADER_NO_LOGO, TRANSPARENT_NO_LOGO_HEADER } from '../../components/header/ScreenOptions';
import SubscriptionScreen from '../../screens/subscriptions/SubscriptionScreen';
import CreatorsProfilesStack from '../brands/CreatorsProfilesStack';
import EventsScreen from '../../screens/app/home/EventsScreen';
import EventDetailsScreen from '../../screens/app/home/EventDetailsScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';
import FavoriteEventsScreen from '../../screens/app/home/FavoriteEventsScreen';

const Stack = createStackNavigator();;
const { Navigator, Screen } = Stack;

const AppStack = () => (
    <Navigator
        initialRouteName={APP_TABS}
        screenOptions={{
            ...SWITCH,
            freezeOnBlur: true,
            animationEnabled: false,
            gestureEnabled: false, 
            transitionSpec: {
                open: { animation: 'timing', config: { duration: 200 } },
                close: { animation: 'timing', config: { duration: 200 } },
            }
        }}
    >
        <Screen
            name={APP_TABS}
            options={{ headerShown: false }}
            component={AppTabs}
        />
        <Screen
            name={SUBSCRIPTION}
            component={SubscriptionScreen}
            options={TRANSPARENT_HEADER_NO_LOGO}
        />
        <Screen
            name={CREATORS_PROFILES_STACK}
            component={CreatorsProfilesStack}
            options={TRANSPARENT_HEADER}
        />
        <Screen
            name={EVENTS_SCREEN}
            component={EventsScreen}
            options={TRANSPARENT_HEADER}
        />
        <Screen
            name={FAVORITE_EVENTS_SCREEN}
            component={FavoriteEventsScreen}
            options={TRANSPARENT_HEADER}
        />
        <Screen
            name={EVENT_DETAILS_SCREEN}
            component={EventDetailsScreen}
            options={TRANSPARENT_HEADER}
        />
         <Screen
            name={WEBVIEW}
            options={TRANSPARENT_HEADER}
            component={WebviewScreen}
        />
    </Navigator>
);

export default AppStack;
