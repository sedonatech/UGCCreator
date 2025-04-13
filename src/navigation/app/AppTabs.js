import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import {
    CHATS_STACK,
    HOME_STACK,
    OFFERS_STACK,
    PROFILE_STACK,
} from '../ScreenNames';
import HomeStack from './HomeStack';
import OffersStack from './OffersStack';
import ProfileStack from './ProfileStack';
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';
import useNotificationPermissions from '../../hooks/notifications/useNotificationPermissions';
import ChatsStack from '../chats/ChatsStack';
import { ANIMATION_DISABLED_HEADER } from '../../components/header/ScreenOptions';
import useChatRooms from '../../hooks/chats/useChatRooms';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const AppTabs = () => {
    useNotificationPermissions();

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const { fetchUnreadCountInLatestChatRoom } = useChatRooms();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUnread = async () => {
            const result = await fetchUnreadCountInLatestChatRoom();
            setUnreadMessagesCount(result);
        };
        fetchUnread();
    }, [navigation]);

    return (
        <Navigator screenOptions={{
            ...ANIMATION_DISABLED_HEADER,
            lazy: true,
            freezeOnBlur: true,
            animationEnabled: false,
            gestureEnabled: false,
        }}
        >
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
                    tabBarLabel: (props) => (
                        <TabLabel
                            {...props}
                            showNotification={unreadMessagesCount}
                        >
                            Chats
                        </TabLabel>
                    ),
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
