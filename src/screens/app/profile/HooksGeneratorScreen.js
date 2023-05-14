import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import { PAYWALL_PRIMARY_BACKGROUND } from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';

const HooksGeneratorScreen = () => (
    <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
    >
        <TemplateBox>
            <TemplateText>Hooks Generator</TemplateText>
        </TemplateBox>
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,

    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },
});
export default HooksGeneratorScreen;
