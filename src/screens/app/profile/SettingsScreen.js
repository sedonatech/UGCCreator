import React, { useEffect, useLayoutEffect } from 'react';
import {
    Alert, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import {
    BLACK_10, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import useLogout from './useLogout';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE } from '../../../consts/content/Home';
import SettingsRow from './components/SettingsRow';
import {
    FORGOT_PASSWORD, SUBSCRIPTION, UGCAI, UPDATE_PORTFOLIO, WEBVIEW,
} from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { useConfig } from '../../../context/core';
import useNotificationPermissions from '../../../hooks/notifications/useNotificationPermissions';

const SettingsScreen = ({ navigation }) => {
    const { logout: handleLogout, deleteAccount } = useLogout();

    const { mainDomain } = useConfig();

    const { auth } = useAuthContext();

    const isFocused = useIsFocused();

    const {
        checkApplicationPermissions,
        isAuthorized,
    } = useNotificationPermissions();

    const {
        getProfileCompleteStatus,
        profileCompleteRatio,
        profile,
        user,
    } = auth;

    useEffect(() => {
        if (isFocused) {
            getProfileCompleteStatus();
        }
    }, [isFocused, profile, user]);

    const settings = [
        {
            title: 'UGC Creator Tools',
            description: 'Explore our creator tools powered by OpenAI',
            onPress: () => navigation.navigate(UGCAI),
            icon: 'trending-up-outline',
        },
        {
            title: 'Email',
            description: auth?.user?.email,
            onPress: () => '',
            icon: 'mail-outline',
        },
        {
            title: 'Update Portfolio',
            description: 'Update your portfolio details',
            onPress: () => navigation.navigate(UPDATE_PORTFOLIO),
            icon: 'person-outline',
        },
        {
            title: 'Change Password',
            description: 'Change your password',
            onPress: () => navigation.navigate(FORGOT_PASSWORD, {
                isUpdate: true,
            }),
            icon: 'lock-closed-outline',
        },
        {
            title: 'Notifications',
            description: 'Manage your notifications',
            onPress: () => {
                if (isAuthorized) {
                    Alert.alert(
                        'Notifications',
                        'You have already granted permission to receive notifications. If you would like to change your notification settings, please go to your phone settings.',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                            },
                        ],
                    );
                } else {
                    checkApplicationPermissions();
                }
            },
            icon: 'notifications-outline',
        },
        {
            title: 'Privacy',
            description: 'Manage your privacy settings',
            onPress: () => {
                if (mainDomain) {
                    navigation.navigate(
                        WEBVIEW,
                        {
                            url: mainDomain,

                        },
                    );
                }
            },
            icon: 'lock-closed-outline',
        },
        {
            title: 'Help',
            description: 'Get help with your account',
            onPress: () => {
                if (mainDomain) {
                    navigation.navigate(
                        WEBVIEW,
                        {
                            url: mainDomain,

                        },
                    );
                }
            },
            icon: 'help-circle-outline',
        },
        {
            title: 'About',
            description: 'Learn more about us',
            onPress: () => '',
            icon: 'information-circle-outline',
        },
        {
            title: 'Subscription',
            description: 'Manage Subscription settings',
            onPress: () => navigation.navigate(SUBSCRIPTION, {
                fromSettings: true,
            }),
            icon: 'card-outline',
        },
        {
            title: 'Delete Account',
            description: 'Delete your account',
            onPress: deleteAccount,
            icon: 'trash-outline',
        },
        {
            title: 'Logout',
            description: 'Logout of your account',
            onPress: handleLogout,
            icon: 'log-out-outline',
        },

    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={BLACK_10}
                    ml={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <ProfileStatusCard
                title={PROFILE_INCOMPLETE_TITLE}
                description={PROFILE_INCOMPLETE_MESSAGE}
                progress={profileCompleteRatio}
                style={styles.statusCard}
                slideInDelay={100}
                showIcon={false}
            />
            <TemplateBox mh={WRAPPER_MARGIN} mb={WRAPPER_MARGIN * 3}>
                {settings.map(({
                    title, description, onPress, icon,
                }) => (
                    <TouchableOpacity onPress={onPress}>
                        <SettingsRow
                            title={title}
                            subtitle={description}
                            onPress={onPress}
                            icon={icon}
                            key={title}
                        />
                    </TouchableOpacity>
                ))}
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    statusCard: {
        marginTop: HEADER_MARGIN + WRAPPER_MARGIN,
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default SettingsScreen;
