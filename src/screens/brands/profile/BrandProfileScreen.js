import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
    BLACK_10,
    LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE } from '../../../consts/content/Home';

import { FORGOT_PASSWORD, UPDATE_PORTFOLIO } from '../../../navigation/ScreenNames';
import SettingsRow from '../../app/profile/components/SettingsRow';
import useLogout from '../../app/profile/useLogout';

const SettingsScreen = ({ navigation }) => {
    const { logout: handleLogout } = useLogout();

    const profileCompleteProgress = 0.4;

    const settings = [
        {
            title: 'Edit Brand Profile',
            description: 'Update your brand profile',
            onPress: () => navigation.navigate(UPDATE_PORTFOLIO),
            icon: 'person-outline',
        },
        {
            title: 'Change Admin Password',
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
export default SettingsScreen;
