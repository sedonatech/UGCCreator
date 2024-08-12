import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import {
    BLACK_60,
    TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN,
    IS_ANDROID, SPACE_XLARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import {
    BRAND_PROFILE_INCOMPLETE_MESSAGE,
    BRAND_PROFILE_INCOMPLETE_TITLE,
} from '../../../consts/content/Home';
import {
    FORGOT_PASSWORD,
    SUBSCRIPTION,
    UPDATE_BRAND_PROFILE,
    WEBVIEW,
} from '../../../navigation/ScreenNames';
import SettingsRow from '../../app/profile/components/SettingsRow';
import useLogout from '../../app/profile/useLogout';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { useConfig } from '../../../context/core';
import useNotificationPermissions from '../../../hooks/notifications/useNotificationPermissions';
import TemplateText from '../../../components/TemplateText';
import useGetAppVersion from '../../../Utils/useGetAppVersion';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';

const BrandSettingsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();

    const { mainDomain } = useConfig();

    const { logout: handleLogout, deleteAccount } = useLogout();

    const { nativeAppVersion } = useGetAppVersion();

    const { support } = useFeatureFlags();

    console.log({ userEmail });

    console.log({ isSupportChatAdmin });

    const {
        checkApplicationPermissions,
        isAuthorized,
    } = useNotificationPermissions();

    const {
        auth,
    } = useAuthContext();

    const {
        getProfileCompleteStatus,
        profileCompleteRatio,
        profile,
        user,
    } = auth;

    const userEmail = profile?.email;

    // Check if the  user's  email is in the support emails
    const isSupportChatAdmin = support?.emails?.includes(userEmail);

    useEffect(() => {
        if (isFocused) {
            getProfileCompleteStatus();
        }
    }, [isFocused, profile, user]);

    const settings = [
        {
            title: 'Email',
            description: auth?.user?.email,
            onPress: () => '',
            icon: 'mail-outline',
        },
        {
            title: 'Edit Brand Profile',
            description: 'This information will be visible to creators',
            onPress: () => navigation.navigate(UPDATE_BRAND_PROFILE),
            icon: 'person-outline',
        },
        {
            title: 'Change Admin Password',
            description: 'Change your admin password',
            onPress: () => navigation.navigate(FORGOT_PASSWORD, {
                isUpdate: true,
            }),
            icon: 'lock-closed-outline',
        },
        {
            title: 'Notifications',
            description: 'Manage your notifications settings',
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
        // {
        //     title: 'Subscription',
        //     description: 'Manage Subscription settings',
        //     onPress: () => navigation.navigate(SUBSCRIPTION, {
        //         fromSettings: true,
        //     }),
        //     icon: 'card-outline',
        // },
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
            icon: 'information-circle-outline',
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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {
                profileCompleteRatio < 1 && (
                    <TemplateBox mv={SPACE_XLARGE} mt={HEADER_MARGIN}>
                        <ProfileStatusCard
                            title={BRAND_PROFILE_INCOMPLETE_TITLE}
                            description={BRAND_PROFILE_INCOMPLETE_MESSAGE}
                            progress={profileCompleteRatio}
                            slideInDelay={100}
                            onPress={() => navigation.navigate(UPDATE_BRAND_PROFILE)}
                        />
                    </TemplateBox>
                )
            }
            <TemplateBox
                mh={WRAPPER_MARGIN}
                mb={WRAPPER_MARGIN * 3}
                mt={profileCompleteRatio < 1 ? 0 : (WRAPPER_MARGIN * 8)}

            >
                {
                    isSupportChatAdmin && (
                        <SettingsRow
                            title="Support Chat"
                            subtitle="Chat with support"
                            onPress={() => 'TO BE ADDED TO NEXT RELEASE'}
                            icon="chatbubble-ellipses-outline"
                        />
                    )
                }
                {settings.map(({
                    title, description, onPress, icon,
                }) => (
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
                    <TemplateText size={14} color={BLACK_60}>{`App Version: ${nativeAppVersion}`}</TemplateText>
                </TemplateBox>
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

});
export default BrandSettingsScreen;
