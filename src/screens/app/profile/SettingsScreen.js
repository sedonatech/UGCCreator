import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import {
    BLACK_10,
    LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';
import useLogout from './useLogout';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE } from '../../../consts/content/Home';
import SettingsRow from './components/SettingsRow';
import {
    FORGOT_PASSWORD, SUBSCRIPTION, UPDATE_PORTFOLIO,
} from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const SettingsScreen = ({ navigation }) => {
    const { logout: handleLogout } = useLogout();

    const { auth } = useAuthContext();

    const isFocused = useIsFocused();

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
        // {
        //     title: 'Open AI',
        //     description: 'Explore the Open AI platform',
        //     onPress: () => navigation.navigate(UGCAI),
        //     icon: 'trending-up-outline',
        // },
        {
            title: 'Email',
            description: auth?.user?.email,
            onPress: () => '',
            icon: 'mail-outline',
        },
        {
            title: 'Edit Portfolio',
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
            onPress: () => '',
            icon: 'notifications-outline',
        },
        {
            title: 'Privacy',
            description: 'Manage your privacy settings',
            onPress: () => '',
            icon: 'lock-closed-outline',
        },
        {
            title: 'Help',
            description: 'Get help with your account',
            onPress: () => '',
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
            onPress: () => navigation.navigate(SUBSCRIPTION),
            icon: 'card-outline',
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
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
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
                    <SettingsRow
                        title={title}
                        subtitle={description}
                        onPress={onPress}
                        icon={icon}
                        key={title}
                    />
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
