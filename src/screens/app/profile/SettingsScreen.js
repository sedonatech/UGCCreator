/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { BLACK_10, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import useLogout from './useLogout';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE } from '../../../consts/content/Home';
import SettingsRow from './components/SettingsRow';
import { FORGOT_PASSWORD, SUBSCRIPTION, UPDATE_PORTFOLIO } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useNotificationPermissions from '../../../hooks/notifications/useNotificationPermissions';
import { wp } from '../../../Utils/getResponsiveSize';
import DeleteUserModal from '../../../components/modals/DeleteUserModal';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';

const SettingsScreen = ({ navigation }) => {
    const { logout: handleLogout } = useLogout();
    const { auth } = useAuthContext();
    const isFocused = useIsFocused();
    const { checkApplicationPermissions, isAuthorized } = useNotificationPermissions();
    const { getProfileCompleteStatus, profileCompleteRatio, profile, user } = auth;
    const { testers } = useFeatureFlags();

    const testEmails = testers?.emails || [];
    const isTester = useMemo(() => {
        if (user?.email) {
            return testEmails.includes(user?.email);
        }
        return false;
    }, [user, testEmails]);

    useEffect(() => {
        if (isFocused) {
            getProfileCompleteStatus();
        }
    }, [isFocused, profile, user]);

    const [showDeleteUser, setShowDeleteUser] = useState(false);

    const settings = [
        {
            title: 'Email',
            description: auth?.user?.email,
            onPress: () => '',
        },
        {
            title: 'Feedback',
            description: 'Send us your feedback',
            onPress: () =>
                navigation.navigate('WebView', {
                    url: 'https://docs.google.com/forms/d/e/1FAIpQLScOnFg0D06OPE5T5w7SZEcy12m9Si0JMAhOAGjGqj5NtMMVgA/viewform?usp=publish-editor',
                }),
            icon: 'chatbox-ellipses-outline',
        },
        isTester && {
            title: 'Test Subscriptions',
            description: 'Test subscription (testers only)',
            onPress: () => navigation.navigate(SUBSCRIPTION, { fromSettings: true }),
            icon: 'card-outline',
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
            onPress: () =>
                navigation.navigate(FORGOT_PASSWORD, {
                    isUpdate: true,
                }),
            icon: 'lock-closed-outline',
        },
        {
            title: 'Notifications',
            description: 'Manage your notifications',
            onPress: async () => {
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
                    await checkApplicationPermissions();
                }
            },
            icon: 'notifications-outline',
        },
        {
            title: 'Delete Account',
            description: 'Delete your account',
            onPress: () => setShowDeleteUser(true),
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
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                data={settings}
                renderItem={({ item }) => (
                    <SettingsRow
                        title={item.title}
                        subtitle={item.description}
                        onPress={item.onPress}
                        icon={item.icon}
                        isLast={item.title === 'Logout'}
                        isFirst={item.title === 'Email'}
                    />
                )}
                keyExtractor={item => item.title}
                ListHeaderComponent={() => (
                    <ProfileStatusCard
                        title={PROFILE_INCOMPLETE_TITLE}
                        description={PROFILE_INCOMPLETE_MESSAGE}
                        progress={profileCompleteRatio}
                        style={styles.statusCard}
                        slideInDelay={100}
                        showIcon={false}
                    />
                )}
            />
            <DeleteUserModal onClose={() => setShowDeleteUser(false)} visible={showDeleteUser} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: wp(100),
        paddingHorizontal: wp(WRAPPER_MARGIN),
    },
    statusCard: {
        marginTop: HEADER_MARGIN,
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default SettingsScreen;
