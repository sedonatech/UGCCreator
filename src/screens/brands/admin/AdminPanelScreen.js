import React, {useLayoutEffect, useMemo, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import TemplateText from '../../../components/TemplateText';
import {
  BLACK,
  BLACK_30,
  BLACK_50,
  BLUE,
  DEEP_LAVENDER,
  DEEP_PURPLE,
  GREEN,
  LIGHT_PURPLE,
  WHITE,
} from '../../../theme/Colors';
import TemplateTouchable from '../../../components/TemplateTouchable';
import {SCREEN_WIDTH, WRAPPER_MARGIN} from '../../../theme/Layout';
import useGetCreators from '../../../hooks/brands/useGetCreators';
import useFirebaseGetStorage from '../../../hooks/imageUpload/useFirebaseGetStorage';
import {indexOf} from 'lodash';
import Button from '../../../components/Button';
import Blob from '../../../../asssets/svgs/Blob';

const defaultImage =
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60';

const StatCard = ({title, value, emoji, color}) => {
  return (
    <View style={styles.statsContainer}>
      <TemplateText color={DEEP_PURPLE} size={12} semiBold>
        {title}
      </TemplateText>
      <View style={styles.valueWrapper}>
        <View style={[styles.emojiContainer, {backgroundColor: color}]}>
          <TemplateText size={14}>{emoji}</TemplateText>
        </View>
        <TemplateText bold size={18} color={DEEP_PURPLE}>
          {value}
        </TemplateText>
      </View>
    </View>
  );
};

const ContentCard = ({creator, isLast, hasRequest}) => {
  const [avatar, setAvatar] = useState('');
  const {getAvatar} = useFirebaseGetStorage();
  const getCreatorAvatar = async id => {
    try {
      let avatar;
      const response = await getAvatar(id);
      if (response?.url) {
        avatar = response?.url;
      } else {
        avatar = defaultImage;
      }

      return avatar;
    } catch (error) {
      console.log('-> error', error);
    }
  };

  useLayoutEffect(() => {
    (async () => {
      const avatarUrl = await getCreatorAvatar(creator?.id);
      setAvatar(avatarUrl);
    })();
  }, [creator]);

  return (
    <View>
      <View style={styles.contentCard}>
        <View style={styles.imageContainer}>
          {avatar && <Image source={{uri: avatar}} style={styles.image} />}
          <View>
            <TemplateText startCase color={DEEP_PURPLE} size={16}>
              {creator?.userName}
            </TemplateText>
            <TemplateText startCase color={BLACK_50} size={12}>
              Berlin, Germany
            </TemplateText>
          </View>
        </View>

        {hasRequest ? (
          <TemplateTouchable style={styles.addButton}>
            <TemplateText color={WHITE} size={12}>
              review
            </TemplateText>
          </TemplateTouchable>
        ) : (
          <TemplateText color={BLACK_50} size={12}>
            yesterday
          </TemplateText>
        )}
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
};

StatCard.defaultProps = {
  title: 'Title',
  value: 0,
  emoji: '👍',
  color: DEEP_PURPLE,
};

const AdminPanelScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TemplateTouchable style={styles.addButton}>
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
        <View style={styles.statsWrapper}>
          <StatCard
            title="Open Projects"
            value="60"
            emoji="💪🏻"
            color="#E6FAF7"
          />
          <StatCard
            title="Total Creators"
            value="10,100"
            emoji="👥"
            color="#FFDE9F"
          />
          <StatCard
            title="Closed Projects"
            value="16"
            emoji="🎉"
            color="#E7FAFD"
          />
          <StatCard
            title="Total Payouts"
            value="24,000"
            emoji="💷"
            color="#DADBFB"
          />
        </View>

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
                  <ContentCard
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
                <ContentCard
                  key={creator?.id}
                  creator={creator}
                  isLast={creator === creators[creators?.length - 1]}
                />
              );
            })}
        </View>

        {/*<TemplateText>New creators </TemplateText>*/}

        {/*<TemplateText>Projects Statuses</TemplateText>*/}
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
  statsWrapper: {
    padding: 20,
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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
});
export default AdminPanelScreen;
