import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLACK,
  BLACK_50,
  BLUE,
  DEEP_LAVENDER,
  DEEP_PURPLE,
  LAVENDER,
  LIGHT_PURPLE,
  WHITE,
} from '../../../theme/Colors';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WRAPPER_MARGIN,
} from '../../../theme/Layout';

import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Blob from '../../../../asssets/svgs/Blob';

import CurrentProjectsCarousel from './components /CurrentProjectsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import TemplateText from '../../../components/TemplateText';
import TemplateTouchable from '../../../components/TemplateTouchable';
import {PROJECTS, STATS} from '../../../consts/content/Home';
import Stats from '../../../components/Stats';
import ContentCard from '../../../components/cards/ContentCard';

const HomeScreen = () => {
  const {auth} = useAuthContext();

  const profile = auth?.profile;
  return (
    <ScrollView style={styles.container}>
      <View>
        <Blob top />
        <Blob right color={LAVENDER} />
        <Blob color={LAVENDER} bottom />
        <Blob center />
      </View>

      {profile?.userName && (
        <Greeting userName={profile?.userName} style={styles.greeting} />
      )}

      <Stats stats={STATS} />

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

        {PROJECTS.map((creator, index) => {
          return (
            <ContentCard
              key={creator?.id}
              image={creator?.image}
              title={creator?.title}
              description={creator?.description}
              subtitle={creator?.shortDescription}
              isLast={creator === PROJECTS[PROJECTS?.length - 1]}
              buttonTitle="View"
            />
          );
        })}
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
    marginBottom: WRAPPER_MARGIN,
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
