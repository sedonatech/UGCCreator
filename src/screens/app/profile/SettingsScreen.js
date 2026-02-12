/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { BLACK_10, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import useLogout from './useLogout';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import SettingsRow from './components/SettingsRow';
import { FORGOT_PASSWORD, SUBSCRIPTION, UPDATE_PORTFOLIO } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useNotificationPermissions from '../../../hooks/notifications/useNotificationPermissions';
import { wp } from '../../../Utils/getResponsiveSize';
import DeleteUserModal from '../../../components/modals/DeleteUserModal';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import LanguageSelector from '../../../components/LanguageSelector';
import useTranslation from '../../../hooks/useTranslation';

const SettingsScreen = ({ navigation }) => {
    const { logout: handleLogout } = useLogout();
    const { auth } = useAuthContext();
    const isFocused = useIsFocused();
    const { checkApplicationPermissions, isAuthorized } = useNotificationPermissions();
    const { getProfileCompleteStatus, profileCompleteRatio, profile, user } = auth;
    const { testers } = useFeatureFlags();
    const { languageInfo, t } = useTranslation();

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
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const settings = [
        {
            title: t('settings.rows.email.title'),
            description: auth?.user?.email,
            onPress: () => '',
        },
        {
            title: t('settings.rows.language.title'),
            description: languageInfo.nativeName,
            onPress: () => setShowLanguageSelector(true),
            icon: 'language-outline',
        },
        {
            title: t('settings.rows.feedback.title'),
            description: t('settings.rows.feedback.description'),
            onPress: () =>
                navigation.navigate('WebView', {
                    url: 'https://docs.google.com/forms/d/e/1FAIpQLScOnFg0D06OPE5T5w7SZEcy12m9Si0JMAhOAGjGqj5NtMMVgA/viewform?usp=publish-editor',
                }),
            icon: 'chatbox-ellipses-outline',
        },
        isTester && {
            title: t('settings.rows.testSubscriptions.title'),
            description: t('settings.rows.testSubscriptions.description'),
            onPress: () => navigation.navigate(SUBSCRIPTION, { fromSettings: true }),
            icon: 'card-outline',
        },
        {
            title: t('settings.rows.updatePortfolio.title'),
            description: t('settings.rows.updatePortfolio.description'),
            onPress: () => navigation.navigate(UPDATE_PORTFOLIO),
            icon: 'person-outline',
        },
        {
            title: t('settings.rows.changePassword.title'),
            description: t('settings.rows.changePassword.description'),
            onPress: () =>
                navigation.navigate(FORGOT_PASSWORD, {
                    isUpdate: true,
                }),
            icon: 'lock-closed-outline',
        },
        {
            title: t('settings.rows.notifications.title'),
            description: t('settings.rows.notifications.description'),
            onPress: async () => {
                if (isAuthorized) {
                    Alert.alert(
                        t('settings.rows.notifications.alertTitle'),
                        t('settings.rows.notifications.alertMessage'),
                        [
                            {
                                text: t('settings.rows.notifications.cancelButton'),
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
            title: t('settings.rows.deleteAccount.title'),
            description: t('settings.rows.deleteAccount.description'),
            onPress: () => setShowDeleteUser(true),
            icon: 'trash-outline',
        },
        {
            title: t('settings.rows.logout.title'),
            description: t('settings.rows.logout.description'),
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
                        title={t('settings.profileIncompleteCard.title')}
                        description={t('settings.profileIncompleteCard.description')}
                        progress={profileCompleteRatio}
                        style={styles.statusCard}
                        slideInDelay={100}
                        showIcon={false}
                    />
                )}
            />
            <DeleteUserModal onClose={() => setShowDeleteUser(false)} visible={showDeleteUser} />
            <LanguageSelector visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
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
