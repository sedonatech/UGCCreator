import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { LAVENDER, WHITE } from '../../theme/Colors';

const ChatsScreen = () => (
    <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
    >
        <TemplateBox>
            <Blob top color={LAVENDER} />
            <Blob right color={LAVENDER} />
            <Blob color={LAVENDER} bottom />
            <Blob center />
        </TemplateBox>
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
});
export default ChatsScreen;
