import React, {useLayoutEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import TemplateText from '../../../components/TemplateText';
import {
  BLACK_50,
  BLUE,
  DEEP_LAVENDER,
  DEEP_PURPLE,
  WHITE,
} from '../../../theme/Colors';
import TemplateTouchable from '../../../components/TemplateTouchable';
import {SCREEN_WIDTH, WRAPPER_MARGIN} from '../../../theme/Layout';
import useGetCreators from '../../../hooks/brands/useGetCreators';
import Blob from '../../../../asssets/svgs/Blob';
import Stats from '../../../components/Stats';
import {STATS} from '../../../consts/content/Home';
import ContentSection from './components/ContentSection';
import {ADD_PROJECT} from '../../../navigation/ScreenNames';

const AdminPanelScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TemplateTouchable
          style={styles.addButton}
          onPress={() => navigation.navigate(ADD_PROJECT)}>
          <TemplateText bold caps size={10} color={WHITE}>
            Add project
          </TemplateText>
        </TemplateTouchable>
      ),
    });
  }, [navigation]);

  const {creators} = useGetCreators();

  const creatorsWithRequest = useMemo(() => {
    if (!creators) {
      return [];
    }
    return creators?.filter(({projects}) => projects?.length > 0);
  }, [creators]);

  return (
    <>
      <ScrollView style={styles.container}>
        <Blob color={DEEP_LAVENDER} top />
        <Blob right />
        <Blob color={DEEP_LAVENDER} bottom />
        <Blob center />

        {/*<Stats stats={STATS} style={styles.stats} />*/}

        <View style={styles.content}>
          <View style={styles.contentTitleContainer}>
            <TemplateText
              startCase
              size={18}
              color={DEEP_PURPLE}
              style={styles.contentTitle}>
              New creator requests
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

          {!!creatorsWithRequest?.length &&
            creatorsWithRequest
              ?.filter(({projects}) => projects?.length > 0)
              ?.map((creator, index) => {
                return (
                  <ContentSection
                    key={creator?.id}
                    creator={creator}
                    isLast={
                      creator ===
                      creatorsWithRequest[creatorsWithRequest?.length - 1]
                    }
                    hasRequest
                  />
                );
              })}
        </View>

        <View style={styles.content}>
          <View style={styles.contentTitleContainer}>
            <TemplateText
              startCase
              size={18}
              color={DEEP_PURPLE}
              style={styles.contentTitle}>
              New Creators
            </TemplateText>

            <View />
            <TemplateTouchable>
              <TemplateText
                startCase
                size={14}
                underline
                color={BLUE}
                style={styles.contentTitle}>
                View all
              </TemplateText>
            </TemplateTouchable>
          </View>

          {!!creators?.length &&
            creators?.map((creator, index) => {
              return (
                <ContentSection
                  key={creator?.id}
                  creator={creator}
                  isLast={creator === creators[creators?.length - 1]}
                />
              );
            })}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
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
  stats: {
    marginTop: 100,
  },
  statsContainer: {
    width: SCREEN_WIDTH / 2 - 30,
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: BLACK_50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  emojiContainer: {
    height: 30,
    width: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
});
export default AdminPanelScreen;
