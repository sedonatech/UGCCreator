import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import {WHITE} from '../../../theme/Colors';
import {SCREEN_HEIGHT, WRAPPER_MARGIN} from '../../../theme/Layout';
import useAuthState from '../../../hooks/auth/useAuthState';
import Greeting from './components /Greeting';
import TrendingCategoriesCarousel from './components /TrendingCategoriesCarousel';

const HomeScreen = () => {
  const {user} = useAuthState();

  return (
    <ScrollView style={styles.container}>
      {user?.displayName && (
        <Greeting userName={user?.displayName} style={styles.greeting} />
      )}
      <TrendingCategoriesCarousel />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
  },
  greeting: {
    marginTop: SCREEN_HEIGHT * 0.14,
    marginBottom: WRAPPER_MARGIN * 2,
    marginHorizontal: WRAPPER_MARGIN,
  },
});
export default HomeScreen;
