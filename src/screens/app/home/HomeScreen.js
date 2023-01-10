import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {WHITE} from '../../../theme/Colors';
import {SCREEN_HEIGHT, WRAPPER_MARGIN} from '../../../theme/Layout';

import Greeting from './components /Greeting';
import TrendingCategoriesCarousel from './components /TrendingCategoriesCarousel';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const HomeScreen = () => {
  const {auth} = useAuthContext();

  const profile = auth?.profile;
  return (
    <ScrollView style={styles.container}>
      {profile?.userName && (
        <Greeting userName={profile?.userName} style={styles.greeting} />
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
