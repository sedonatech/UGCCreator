import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ADMIN_PANEL_STACK, BRANDS_PROFILE_STACK, CHATS_STACK, CREATORS_PROFILES_STACK } from '../ScreenNames';
import TabButton from '../../components/tabs/TabButton';
import TabLabel from '../../components/tabs/TabLabel';
import AdminPanelStack from './AdminPanelStack';
import CreatorsProfilesStack from './CreatorsProfilesStack';
import BrandsProfileStack from './BrandsProfileStack';
import ChatsStack from '../chats/ChatsStack';
import useNotificationPermissions from '../../hooks/notifications/useNotificationPermissions';
import useTranslation from '../../hooks/useTranslation';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const BrandsTabs = () => {
    const { t } = useTranslation();
    useNotificationPermissions();
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name={ADMIN_PANEL_STACK}
                component={AdminPanelStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Home" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.admin')}</TabLabel>,
                }}
            />
            <Screen
                name={CREATORS_PROFILES_STACK}
                component={CreatorsProfilesStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="People" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.explore')}</TabLabel>,
                }}
            />
            <Screen
                name={CHATS_STACK}
                component={ChatsStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Chat" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.chats')}</TabLabel>,
                }}
            />
            <Screen
                name={BRANDS_PROFILE_STACK}
                component={BrandsProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => <TabButton focused={focused} icon="Profile" />,
                    tabBarLabel: props => <TabLabel {...props}>{t('tabs.brandProfile')}</TabLabel>,
                }}
            />
        </Navigator>
    );
};

export default BrandsTabs;
