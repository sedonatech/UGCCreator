import 'react-native-gesture-handler';
import React from 'react';
import {
    StatusBar, useColorScheme, View, StyleSheet,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { FeatureFlagProvider } from './src/context/FeatureFlagsContext';
import defaultFeatures from './config/defaultFeatures';
import { BRAND_BLUE, TRANSPARENT, WHITE } from './src/theme/Colors';
import { IS_ANDROID } from './src/theme/Layout';

const NAVIGATION_THEME = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: IS_ANDROID ? TRANSPARENT : BRAND_BLUE,
    },
};
const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View style={styles.container}>
            <FeatureFlagProvider defaultFeatures={defaultFeatures}>
                <AuthProvider>
                    <ActionSheetProvider>
                        <NavigationContainer
                            theme={NAVIGATION_THEME}
                        >
                            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                            <MainNavigator />
                        </NavigationContainer>
                    </ActionSheetProvider>
                </AuthProvider>
            </FeatureFlagProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : BRAND_BLUE,

    },
});

export default App;
