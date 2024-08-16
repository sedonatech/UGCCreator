import React, {memo, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Fuse from 'fuse.js';
import firestore from '@react-native-firebase/firestore';
import {
  HEADER_MARGIN,
  IS_ANDROID,
  WRAPPED_SCREEN_WIDTH,
  WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
  BLACK,
  DARK_GREY,
  GREY,
  TRANSPARENT,
  WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateTextInput from '../../../components/TemplateTextInput';
import {SHADOW} from '../../../theme/Shadow';
import {EVENT_DETAILS_SCREEN} from '../../../navigation/ScreenNames';
import {EVENTS_COLLECTION} from '../../../hooks/brands/useEvents';
import {hp, wp} from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import ResizedImage from '../../../components/ResizedImage';
import {months} from '../../../consts/months';
import { isAndroid } from '../../../Utils/Platform';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const FavoriteEventsScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [limit, setLimit] = useState(20);

  const { auth } = useAuthContext();
  const { profile, update} = auth;

  const favoriteEventsIds = profile?.favoriteEvents

  const eventsRef = firestore()
    .collection(EVENTS_COLLECTION)
    .orderBy('endDate', 'desc')
    .orderBy('createdAt', 'desc')
    .limit(limit);

  const fetchEvents = async () => {
    try {
        const fetchedEvents = await eventsRef
        .where('eventId', 'in', favoriteEventsIds)
        .get()
        .then((querySnapshot) => querySnapshot?.docs
            ?.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
            })));
      setEventsData(fetchedEvents);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if(favoriteEventsIds)fetchEvents();
  }, [limit, favoriteEventsIds]);

  const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name', 'title', 'shortDescription'],
  };

  useEffect(() => {
    if (!!search && eventsData?.length) {
      const fuse = new Fuse(eventsData, options);
      const results = fuse.search(search).map(({item}) => item);
      setSearchResults(results);
    }
  }, [search, eventsData]);

  const events = useMemo(() => {
    if (!eventsData?.length) {
      return [];
    }
    return eventsData
      ?.map(event => ({
        id: event?.id,
        name: event?.title,
        description: event?.description,
        image: event?.image,
        country: event?.country,
        city: event?.city,
        startDate: event?.startDate,
      }))
      ?.sort((a, b) => a?.startDate?.seconds - b?.startDate?.seconds);
  }, [eventsData]);

  const filteredEvents = useMemo(() => {
    if (!eventsData) return [];
    return search?.length ? searchResults : events;
  }, [search, eventsData, events]);

  return (
    <FlatList
      data={filteredEvents}
      keyExtractor={(item, index) => `${item?.id}-${index}`}
      renderItem={({item}) => {
        const date = new Date(item?.startDate?.seconds * 1000);
        const day = date.getDate();
        const month = months[date.getMonth()];
        return (
          <TemplateBox
            width={WRAPPED_SCREEN_WIDTH}
            mt={16}
            row
            backgroundColor={WHITE}
            height={hp(92)}
            style={SHADOW('mediumCard', WHITE)}
            ph={wp(6)}
            pv={6}
            borderRadius={10}>
             <TemplateBox zIndex={99} absolute width='100%' height='200%' onPress={()=> navigation.navigate(EVENT_DETAILS_SCREEN, {id: item?.id})}/>
            <TemplateBox
              backgroundColor={GREY}
              width={80}
              mr={12}
              borderRadius={8}
              overflow="hidden">
              <ResizedImage
                source={{uri: item?.image}}
                style={{height: '100%', width: '100%'}}
              />

              <TemplateBox
                zIndex={1}
                absolute
                top={8}
                left={8}
                backgroundColor={WHITE}
                width={25}
                height={25}
                justifyContent="center"
                alignItems="center"
                borderRadius={4}>
                <TemplateText size={hp(10)} semiBold mb={2} center>
                  {day}
                </TemplateText>
                <TemplateText size={hp(8)} light center>
                  {month}
                </TemplateText>
              </TemplateBox>
            </TemplateBox>
            <TemplateBox
              width={WRAPPED_SCREEN_WIDTH - 80}
              flex
              height={'100%'}
              spaceBetween
              justifyContent="space-between"
              pv={hp(4)}>
              <TemplateBox mb={hp(2)}>
                <TemplateBox mb={2}>
                  <TemplateText size={hp(13)}lineHeight={14.5} semiBold mb={2} numberOfLines={2}>
                    {item?.name}
                  </TemplateText>
                </TemplateBox>
                <TemplateText size={hp(12)} lineHeight={13} light color={DARK_GREY} numberOfLines={!item?.country ? 3 : 2}>
                  {item?.description}
                </TemplateText>
              </TemplateBox>
              {!!item?.country && <TemplateBox row alignItems="center">
                <TemplateIcon
                  name="location-sharp"
                  size={hp(11)}
                  family="Ionicons"
                  color={DARK_GREY}
                  style={{marginRight: 3}}
                />
                <TemplateText size={hp(10)} color={DARK_GREY} medium>
                  {`${item?.city}, ${item?.country}`}
                </TemplateText>
              </TemplateBox>}
            </TemplateBox>
          </TemplateBox>
        );
      }}
      ListHeaderComponent={(
        <TemplateBox>
          <TemplateBox
            ml={WRAPPER_MARGIN}
            mt={isAndroid ? 80 : 130}
            alignItems="center"
            justifyContent="center">
            <TemplateText size={18} bold startCase center>
              Favorite Events
            </TemplateText>
          </TemplateBox>

          <TemplateBox
            row
            alignItems="center"
            mh={WRAPPER_MARGIN}
            mt={WRAPPER_MARGIN}>
            <TemplateTextInput
              placeholder="Search"
              style={[styles.input, SHADOW('default', WHITE)]}
              value={search}
              onChangeText={text => setSearch(text)}
              autoCapitalize="none"
            />
          </TemplateBox>
        </TemplateBox>
      )}
      ListEmptyComponent={(
        <TemplateBox flex center mt={hp(HEADER_MARGIN)}>
          <TemplateText size={hp(14)} semiBold>
             {search?.length ? 'Event not found' : 'No favorite events available'}
          </TemplateText>
        </TemplateBox>
      )}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      alwaysBounceVertical={false}
      contentContainerStyle={styles.contentContainer}
      initialNumToRender={10}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        setLimit(prevLimit => prevLimit + 10);
      }}
      // removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
  },
  contentContainer: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingRight: 30,
    paddingLeft: 10,
    fontSize: 16,
    color: BLACK,
  },
  card: {
    marginBottom: WRAPPER_MARGIN,
    alignSelf: 'center',
  },
});

export default memo(FavoriteEventsScreen);
