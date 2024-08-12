import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import {
    ActivityIndicator,
    Alert, ScrollView, StyleSheet,
} from 'react-native';
import { HEADER_MARGIN, IS_ANDROID, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import { BLUE, TRANSPARENT, WHITE } from '../../theme/Colors';
import { hp } from '../../Utils/getResponsiveSize';
import isAndroid from '../subscriptions/utils/isAndroid';
import TemplateBox from '../../components/TemplateBox';

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

    const [loading, setLoading] = useState(true);
    const handleLoad = () => {
        setLoading(false);
    };
    const handleError = () => {
        setLoading(false);
        Alert.alert('Error', 'Something went wrong with this link. Please try again later.');
    };

    return (
        <>
            {loading && (
                <TemplateBox absolute height={SCREEN_HEIGHT} width={SCREEN_WIDTH} zIndex={99} justifyContent='center' alignItems='center'>
                    <ActivityIndicator size="large" color={BLUE} />
                </TemplateBox>
            )}
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            
            <WebView
                source={{ uri: url }}
                style={{ marginTop: isAndroid ? 80 : 120 }}
                onLoad={handleLoad} // Trigger when WebView finishes loading
                onError={handleError}
            />
        </ScrollView>
        </>
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
