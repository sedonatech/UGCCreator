import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import {
    LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN, IS_ANDROID, SPACE_XLARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import {
    BRAND_PROFILE_INCOMPLETE_MESSAGE,
    BRAND_PROFILE_INCOMPLETE_TITLE,
} from '../../../consts/content/Home';
import { FORGOT_PASSWORD, UPDATE_BRAND_PROFILE } from '../../../navigation/ScreenNames';
import SettingsRow from '../../app/profile/components/SettingsRow';
import useLogout from '../../app/profile/useLogout';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const BrandSettingsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const { logout: handleLogout } = useLogout();

    const {
        auth,
    } = useAuthContext();

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
            onPress: () => '',
            icon: 'notifications-outline',
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
            <TemplateBox
                mt={HEADER_MARGIN}
            >
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            {
                profileCompleteRatio < 1 && (
                    <TemplateBox mv={SPACE_XLARGE}>
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

});
export default BrandSettingsScreen;
