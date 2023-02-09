import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateText from '../../../components/TemplateText';
import { LAVENDER, TRANSPARENT, WHITE } from '../../../theme/Colors';
import Button from '../../../components/Button';
import { IS_ANDROID } from '../../../theme/Layout';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';
import useLogout from './useLogout';

const SettingsScreen = () => {
    const { logout: handleLogout } = useLogout();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TemplateBox>
                {/* @ts-ignore */}
                <Blob top color={LAVENDER} />
                {/* @ts-ignore */}
                <Blob right color={LAVENDER} />
                {/* @ts-ignore */}
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <TemplateText>ProfileScreen </TemplateText>
            <Button onPress={handleLogout} title="logout" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default SettingsScreen;
