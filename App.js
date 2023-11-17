import 'react-native-gesture-handler';
import React from 'react';
import {
    StatusBar, View, StyleSheet,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
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
import { SubscriptionProvider } from './src/screens/subscriptions/context/context';
import { ChatsProvider } from './src/context/ChatsProvider';

const NAVIGATION_THEME = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: PAYWALL_PRIMARY_BACKGROUND,
    },
};
const MainApp = () => {
    const purchase = useSubscriptionConfig(true);

    return (
        <View style={styles.container}>
            <CoreProvider config={config}>
                <SubscriptionProvider purchase={purchase}>
                    <ProjectsProvider>
                        <ProjectApplicationProvider>
                            <ActionSheetProvider>
                                <NavigationContainer
                                    theme={NAVIGATION_THEME}
                                >
                                    <StatusBar barStyle="dark-content" />
                                    <ChatsProvider>
                                        <MainNavigator />
                                    </ChatsProvider>
                                </NavigationContainer>
                            </ActionSheetProvider>

                        </ProjectApplicationProvider>
                    </ProjectsProvider>
                </SubscriptionProvider>
            </CoreProvider>
        </View>
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
// TODO: uncomment this when we are ready to use codepush
// export default codePush({
//     checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
// })(App);
