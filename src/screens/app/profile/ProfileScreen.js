import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateText from '../../../components/TemplateText';
import { LAVENDER, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID } from '../../../theme/Layout';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';

const ProfileScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <TemplateBox>
            <Blob top color={LAVENDER} />
            <Blob right color={LAVENDER} />
            <Blob color={LAVENDER} bottom />
            <Blob center />
        </TemplateBox>
        <TemplateText>ProfileScreen </TemplateText>
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default ProfileScreen;
