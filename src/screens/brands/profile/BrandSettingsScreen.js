import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { BLACK_60, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, SPACE_XLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { FORGOT_PASSWORD, SUBSCRIPTION, UPDATE_BRAND_PROFILE, WEBVIEW } from '../../../navigation/ScreenNames';
import SettingsRow from '../../app/profile/components/SettingsRow';
import useLogout from '../../app/profile/useLogout';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { useConfig } from '../../../context/core';
import useNotificationPermissions from '../../../hooks/notifications/useNotificationPermissions';
import TemplateText from '../../../components/TemplateText';
import useGetAppVersion from '../../../Utils/useGetAppVersion';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import LanguageSelector from '../../../components/LanguageSelector';
import useTranslation from '../../../hooks/useTranslation';

const BrandSettingsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();

    const { mainDomain } = useConfig();

    const { logout: handleLogout, deleteAccount } = useLogout();

    const { nativeAppVersion } = useGetAppVersion();

    const { support } = useFeatureFlags();

    const { languageInfo, t } = useTranslation();

    console.log({ userEmail });

    console.log({ isSupportChatAdmin });

    const { checkApplicationPermissions, isAuthorized } = useNotificationPermissions();

    const { auth } = useAuthContext();

    const { getProfileCompleteStatus, profileCompleteRatio, profile, user } = auth;

    const userEmail = profile?.email;

    // Check if the  user's  email is in the support emails
    const isSupportChatAdmin = support?.emails?.includes(userEmail);

    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    useEffect(() => {
        if (isFocused) {
            getProfileCompleteStatus();
        }
    }, [isFocused, profile, user]);

    const settings = [
        {
            title: t('brands.profile.settings.rows.email'),
            description: auth?.user?.email,
            onPress: () => '',
            icon: 'mail-outline',
        },
        {
            title: t('settings.rows.language.title'),
            description: languageInfo.nativeName,
            onPress: () => setShowLanguageSelector(true),
            icon: 'language-outline',
        },
        {
            title: t('brands.profile.settings.rows.editProfile'),
            description: t('brands.profile.settings.rows.editProfileDesc'),
            onPress: () => navigation.navigate(UPDATE_BRAND_PROFILE),
            icon: 'person-outline',
        },
        {
            title: t('brands.profile.settings.rows.changePassword'),
            description: t('brands.profile.settings.rows.changePasswordDesc'),
            onPress: () =>
                navigation.navigate(FORGOT_PASSWORD, {
                    isUpdate: true,
                }),
            icon: 'lock-closed-outline',
        },
        {
            title: t('brands.profile.settings.rows.notifications'),
            description: t('brands.profile.settings.rows.notificationsDesc'),
            onPress: () => {
                if (isAuthorized) {
                    Alert.alert(
                        t('brands.profile.settings.alerts.notificationsTitle'),
                        t('brands.profile.settings.alerts.notificationsMessage'),
                        [
                            {
                                text: t('common.actions.cancel'),
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
        // {
        //     title: 'Subscription',
        //     description: 'Manage Subscription settings',
        //     onPress: () => navigation.navigate(SUBSCRIPTION, {
        //         fromSettings: true,
        //     }),
        //     icon: 'card-outline',
        // },
        {
            title: t('brands.profile.settings.rows.help'),
            description: t('brands.profile.settings.rows.helpDesc'),
            onPress: () => {
                if (mainDomain) {
                    navigation.navigate(WEBVIEW, {
                        url: mainDomain,
                    });
                }
            },
            icon: 'help-circle-outline',
        },
        {
            title: t('brands.profile.settings.rows.about'),
            description: t('brands.profile.settings.rows.aboutDesc'),
            onPress: () => {
                if (mainDomain) {
                    navigation.navigate(WEBVIEW, {
                        url: mainDomain,
                    });
                }
            },
            icon: 'information-circle-outline',
        },
        {
            title: t('brands.profile.settings.rows.deleteAccount'),
            description: t('settings.rows.deleteAccount.description'),
            onPress: deleteAccount,
            icon: 'trash-outline',
        },
        {
            title: t('brands.profile.settings.rows.logout'),
            description: t('settings.rows.logout.description'),
            onPress: handleLogout,
            icon: 'log-out-outline',
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {profileCompleteRatio < 1 && (
                <TemplateBox mv={SPACE_XLARGE} mt={HEADER_MARGIN}>
                    <ProfileStatusCard
                        title={t('brands.profile.settings.profileIncompleteCard.title')}
                        description={t('brands.profile.settings.profileIncompleteCard.description')}
                        progress={profileCompleteRatio}
                        slideInDelay={100}
                        onPress={() => navigation.navigate(UPDATE_BRAND_PROFILE)}
                    />
                </TemplateBox>
            )}
            <TemplateBox
                mh={WRAPPER_MARGIN}
                mb={WRAPPER_MARGIN * 3}
                mt={profileCompleteRatio < 1 ? 0 : WRAPPER_MARGIN * 8}
            >
                {isSupportChatAdmin && (
                    <SettingsRow
                        title={t('brands.profile.settings.rows.supportChat')}
                        subtitle={t('brands.profile.settings.rows.supportChatDesc')}
                        onPress={() => 'TO BE ADDED TO NEXT RELEASE'}
                        icon="chatbubble-ellipses-outline"
                    />
                )}
                {settings.map(({ title, description, onPress, icon }) => (
                    <SettingsRow
                        title={title}
                        subtitle={description}
                        onPress={onPress}
                        icon={icon}
                        key={title}
                        isLast={title === 'Logout'}
                        isFirst={title === 'Email'}
                    />
                ))}
                <TemplateBox selfCenter mv={20}>
                    <TemplateText size={14} color={BLACK_60}>
                        {`${t('brands.profile.settings.appVersionLabel')}: ${nativeAppVersion}`}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
            <LanguageSelector visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
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
});
export default BrandSettingsScreen;
