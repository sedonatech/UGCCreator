import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import {
    Alert, ScrollView, StyleSheet,
} from 'react-native';
import { HEADER_MARGIN, IS_ANDROID } from '../../theme/Layout';
import { TRANSPARENT, WHITE } from '../../theme/Colors';

const urlPattern = new RegExp('^(https?:\\/\\/)?' // validate protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // validate domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // validate OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // validate port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // validate query string
    + '(\\#[-a-z\\d_]*)?$', 'i');

const WebviewScreen = ({ route, navigation }) => {
    const url = route?.params?.url;

    // Check if url is valid
    useEffect(() => {
        if (!urlPattern.test(url)) {
            Alert.alert('Error', 'Something went wrong with this link. Please try again later.', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ]);
        }
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <WebView
                source={{ uri: url }}
                style={{ marginTop: HEADER_MARGIN }}
                onError={() => Alert.alert('Error', 'Something went wrong with this link. Please try again later.')}
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
