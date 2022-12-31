import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
