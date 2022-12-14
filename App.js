/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Logo from './asssets/svgs/Logo';
import Button from './src/components/Button';
import {SCREEN_HEIGHT} from './src/theme/Layout';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Logo style={styles.logo} />
      <Button
        title="Get Started"
        onPress={() => {
          console.log('get started');
        }}
        style={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: SCREEN_HEIGHT / 8,
    alignSelf: 'center',
  },
  button : {
    position: 'absolute',
    bottom: 100
  }
});

export default App;
