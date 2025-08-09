/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View,
} from 'react-native';

import { WebView } from 'react-native-webview';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import TemplateBox from '../../../components/TemplateBox';
import {
    BLACK_10, BLACK_50, IOS_BLUE, PAYWALL_PRIMARY_BACKGROUND,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    SCREEN_WIDTH,
    WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { projectFilters } from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../explore/components/FilterCategory';
import useAITools from '../../../hooks/creatorTools/useAITools';
import Button from '../../../components/Button';
import { CREATOR_TOOLS_RESULTS } from '../../../navigation/ScreenNames';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const REDIRECT_SUCCESS_URL = 'https://us-central1-ugccreatorapp.cloudfunctions.net/facebookAuthCallback/success';
const OAUTH_REDIRECT_BASE = 'https://us-central1-ugccreatorapp.cloudfunctions.net/facebookAuthRedirect';

const AnalyticsCopilotDetailsScreen = ({ navigation, route }) => {
    const title = route.params?.title;
    const description = route.params?.description;

    const user = auth().currentUser;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showWebView, setShowWebView] = useState(false);
    const [webViewUrl, setWebViewUrl] = useState('');

    const [igConnected, setIgConnected] = useState(false);
    const [insights, setInsights] = useState(null);
    const [showFetchButton, setShowFetchButton] = useState(false);

    const checkFirestore = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userRef = firestore().collection('users').doc(user.uid);
            const doc = await userRef.get();
            const data = doc.data() || {};
            const { igUserId, accessToken } = data;

            if (igUserId && accessToken) {
                setIgConnected(true);

                // Check for previously stored insights
                const analyticsSnap = await userRef.collection('analytics')
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .get();

                if (!analyticsSnap.empty) {
                    const doc = analyticsSnap.docs[0];
                    const existingInsights = doc.data().insights;
                    setInsights(existingInsights);
                }

                setShowFetchButton(true);
            }
        } catch (err) {
            console.error('Error checking Firestore:', err);
            setError('Failed to load user data.');
        }
        setLoading(false);
    };

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const doc = await firestore().collection('users').doc(user.uid).get();
            const { igUserId, accessToken } = doc.data() || {};

            if (!igUserId || !accessToken) {
                setError('Instagram account not connected.');
                setLoading(false);
                return;
            }

            const result = await functions().httpsCallable('analyticsCopilot')({
                igUserId,
                accessToken,
            });

            const newInsights = result.data.insights;
            setInsights(newInsights);
            setError(null);
        } catch (err) {
            console.error('Error fetching insights:', err);
            setError('Failed to fetch insights. Try again.');
        }
        setLoading(false);
    };

    const handleWebViewNavigation = async (navState) => {
        const { url } = navState;
        if (url.startsWith(REDIRECT_SUCCESS_URL)) {
            setShowWebView(false);
            setTimeout(() => {
                checkFirestore();
            }, 1200);
        }
    };

    const handleConnectInstagram = () => {
        const oauthUrl = `${OAUTH_REDIRECT_BASE}?uid=${user.uid}`;
        setWebViewUrl(oauthUrl);
        setShowWebView(true);
    };

    useEffect(() => {
        if (user) {
            checkFirestore();
        }
    }, [user]);

    if (showWebView) {
        return (
            <WebView
                source={{ uri: webViewUrl }}
                onNavigationStateChange={handleWebViewNavigation}
                startInLoadingState
                javaScriptEnabled
            />
        );
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox mt={HEADER_MARGIN} mb={50} alignItems="center">
                <TemplateText
                    size={18}
                    bold
                    startCase
                    center
                >
                    {title}
                </TemplateText>
                <TemplateBox height={20} />
                {!!description && (
                    <TemplateBox selfCente ph={10}>
                        <TemplateText
                            size={16}
                            center
                        >
                            {description}
                        </TemplateText>
                    </TemplateBox>
                )}
                <TemplateBox height={20} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
                    📊 Analytics Copilot
                </Text>

                {error && (
                    <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
                )}

                {!igConnected && (
                    <Button title="Connect Instagram" onPress={handleConnectInstagram} />
                )}

                {igConnected && !insights && showFetchButton && (
                    <Button title="Fetch Insights" onPress={fetchInsights} />
                )}

                {insights && (
                    <>
                        <Text style={{ fontWeight: '600', marginBottom: 8 }}>AI Insights:</Text>
                        <Text style={{ lineHeight: 20 }}>{insights}</Text>
                        <View style={{ marginTop: 20 }}>
                            <Button title="Refresh Insights" onPress={fetchInsights} />
                        </View>
                    </>
                )}

                <Button
                    title="Save and Continue"
                    onPress={() => {}}
                    style={styles.button}

                />
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,

    },
    contentContainer: {
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
        alignItems: 'center',
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderColor: BLACK_10,
        borderRadius: 8,
        paddingLeft: 16,
        marginTop: 10,
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
    button: {
        marginTop: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
        width: WRAPPED_SCREEN_WIDTH,
    },
    placeholderStyle: {
        fontSize: 13,
    },
});
export default AnalyticsCopilotDetailsScreen;
