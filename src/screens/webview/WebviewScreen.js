import React from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { HEADER_MARGIN, IS_ANDROID } from '../../theme/Layout';
import { IOS_BLUE, TRANSPARENT, WHITE } from '../../theme/Colors';
import TemplateBox from '../../components/TemplateBox';

const WebviewScreen = ({ route }) => {
    const url = route?.params?.url;

    if (!url) {
        return (
            <TemplateBox alignItems="center" justifyContent="center" selfCenter>
                <ActivityIndicator size="large" color={IOS_BLUE} />
            </TemplateBox>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <WebView
                source={{ uri: url }}
                style={{ marginTop: HEADER_MARGIN }}
            />
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
export default WebviewScreen;
