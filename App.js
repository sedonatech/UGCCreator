import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

import MainNavigator from './src/navigation/MainNavigator';
import {AuthProvider} from './src/context/AuthProvider';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
      <ActionSheetProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <MainNavigator />
        </NavigationContainer>
      </ActionSheetProvider>
    </AuthProvider>
  );
};

export default App;
