import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLACK,
  BLACK_50,
  BLUE,
  DEEP_LAVENDER,
  DEEP_PURPLE,
  LIGHT_PURPLE,
  WHITE,
} from '../../../theme/Colors';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WRAPPER_MARGIN,
} from '../../../theme/Layout';

import Greeting from './components /Greeting';
import TrendingCategoriesCarousel from './components /TrendingCategoriesCarousel';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Blob from '../../../../asssets/svgs/Blob';
import CurrentProjectCard from './components /CurrentProjectCard';
import CurrentProjectsCarousel from './components /CurrentProjectsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import TemplateText from '../../../components/TemplateText';
import TemplateTouchable from '../../../components/TemplateTouchable';
import {PROJECTS} from '../../../consts/content/Home';

const HomeScreen = () => {
  const {auth} = useAuthContext();

  const profile = auth?.profile;
  return (
    <ScrollView style={styles.container}>
      <View>
        <Blob top />
        <Blob right color={DEEP_LAVENDER} />
        <Blob color={DEEP_LAVENDER} bottom />
        <Blob center />
      </View>

      {profile?.userName && (
        <Greeting userName={profile?.userName} style={styles.greeting} />
      )}
      <CurrentProjectsCarousel style={styles.carousel} />
      <BrandsCarousel style={styles.carousel} />
      <View style={styles.content}>
        <View style={styles.contentTitleContainer}>
          <TemplateText
            startCase
            size={18}
            color={DEEP_PURPLE}
            style={styles.contentTitle}>
            New Projects
          </TemplateText>

          <View />
          <TemplateTouchable>
            <TemplateText
              startCase
              size={14}
              color={BLUE}
              style={styles.contentTitle}>
              View all
            </TemplateText>
          </TemplateTouchable>
        </View>

        {/*{PROJECTS.map((creator, index) => {*/}
        {/*  return (*/}
        {/*    <ContentCard*/}
        {/*      key={creator?.id}*/}
        {/*      creator={creator}*/}
        {/*      isLast={*/}
        {/*        creator === creatorsWithRequest[creatorsWithRequest?.length - 1]*/}
        {/*      }*/}
        {/*      hasRequest*/}
        {/*    />*/}
        {/*  );*/}
        {/*})}*/}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  greeting: {
    marginTop: SCREEN_HEIGHT * 0.14,
    marginBottom: WRAPPER_MARGIN * 2,
    marginHorizontal: WRAPPER_MARGIN,
  },
  carousel: {
    marginBottom: WRAPPER_MARGIN,
  },
  content: {
    padding: 10,
    backgroundColor: WHITE,
    borderRadius: 10,
    elevation: 5,
    shadowColor: BLACK_50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    margin: WRAPPER_MARGIN,
    paddingBottom: 20,
  },
  contentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  divider: {
    height: 0.6,
    backgroundColor: LIGHT_PURPLE,
    width: '100%',
    alignSelf: 'center',
    marginVertical: WRAPPER_MARGIN,
  },
  contentTitle: {},
  contentTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 24,
  },
  addButton: {
    marginRight: 20,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#2D3439',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  description: {
    width: SCREEN_WIDTH * 0.58,
  },
});
export default HomeScreen;
