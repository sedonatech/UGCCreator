/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { CHALLENGES_STACK, CHATS_STACK, COURSES_STACK, HOME_STACK, PROFILE_STACK } from '../ScreenNames';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';
import useNotificationPermissions from '../../hooks/notifications/useNotificationPermissions';
import ChatsStack from '../chats/ChatsStack';
import { ANIMATION_DISABLED_HEADER } from '../../components/header/ScreenOptions';
import useChatRooms from '../../hooks/chats/useChatRooms';
import ChallengesStack from './ChallengesStack';
import CoursesStack from './CoursesStack';
import useTranslation from '../../hooks/useTranslation';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const AppTabs = () => {
    const { t } = useTranslation();
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
        <Navigator
            screenOptions={{
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
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Home" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.home')}</TabLabel>,
                }}
            />

            <Screen
                name={CHALLENGES_STACK}
                component={ChallengesStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Trophy" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.challenges')}</TabLabel>,
                }}
            />
            <Screen
                name={CHATS_STACK}
                component={ChatsStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Chat" />,
                    tabBarLabel: props => (
                        <TabLabel {...props} showNotification={unreadMessagesCount}>
                            {t('tabs.chats')}
                        </TabLabel>
                    ),
                }}
            />
            <Screen
                name={COURSES_STACK}
                component={CoursesStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="LevelUp" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.levelUp')}</TabLabel>,
                }}
            />
            <Screen
                name={PROFILE_STACK}
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Profile" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.portfolio')}</TabLabel>,
                }}
            />
        </Navigator>
    );
};

export default AppTabs;
