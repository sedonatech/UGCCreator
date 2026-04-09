import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { StatusBar, View, StyleSheet } from 'react-native';
import { AppEventsLogger, Settings } from 'react-native-fbsdk-next';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { I18nextProvider } from 'react-i18next';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { FeatureFlagProvider } from './src/context/FeatureFlagsContext';
import defaultFeatures from './config/defaultFeatures';
import { PAYWALL_PRIMARY_BACKGROUND } from './src/theme/Colors';
import { ProjectsProvider } from './src/context/ProjectsProvider';
import { ProjectApplicationProvider } from './src/context/ProjectApplicationProvider';
import config from './config';
import { CoreProvider } from './src/context/core';
import useSubscriptionConfig from './src/hooks/subscription/useSubscriptionConfig';
import useSeedBrands from './src/hooks/brands/useSeedBrands';
import { SubscriptionProvider } from './src/screens/subscriptions/context/context';
import { ChatsProvider } from './src/context/ChatsProvider';
import { isAndroid } from './src/Utils/Platform';
import i18n from './src/i18n';

enableScreens();
enableFreeze(true);

const NAVIGATION_THEME = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: PAYWALL_PRIMARY_BACKGROUND,
    },
};
const MainApp = () => {
    const purchase = useSubscriptionConfig(true);
    useSeedBrands();

    useEffect(() => {
        Settings.initializeSDK();
        Settings.setAdvertiserTrackingEnabled(true);
        AppEventsLogger.logEvent(`OPENED-APP-${isAndroid ? 'ANDROID' : 'IOS'}`);
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <View style={styles.container}>
                <CoreProvider config={config}>
                    <SubscriptionProvider purchase={purchase}>
                        <ProjectsProvider>
                            <ProjectApplicationProvider>
                                <ActionSheetProvider>
                                    <NavigationContainer theme={NAVIGATION_THEME}>
                                        <StatusBar barStyle="dark-content" />
                                        <ChatsProvider>
                                            <MainNavigator />
                                            <Toast />
                                        </ChatsProvider>
                                    </NavigationContainer>
                                </ActionSheetProvider>
                            </ProjectApplicationProvider>
                        </ProjectsProvider>
                    </SubscriptionProvider>
                </CoreProvider>
            </View>
        </I18nextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },
});

const App = () => (
    <AuthProvider>
        <FeatureFlagProvider defaultFeatures={defaultFeatures}>
            <MainApp />
        </FeatureFlagProvider>
    </AuthProvider>
);

export default App;
