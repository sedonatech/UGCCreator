import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
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
  BLACK_20,
  DARK_GREY,
  ERROR_RED,
  GREY,
  TRANSPARENT,
  WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateTextInput from '../../../components/TemplateTextInput';
import {SHADOW} from '../../../theme/Shadow';
import {
  EVENT_DETAILS_SCREEN,
  FAVORITE_EVENTS_SCREEN,
} from '../../../navigation/ScreenNames';
import {EVENTS_COLLECTION} from '../../../hooks/brands/useEvents';
import {hp, wp} from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import ResizedImage from '../../../components/ResizedImage';
import {months} from '../../../consts/months';
import {isAndroid} from '../../../Utils/Platform';

const EventsScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [limit, setLimit] = useState(20);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TemplateBox
          mr={wp(12)}
          height={40}
          width={40}
          justifyContent="center"
          alignItems="center"
          borderRadius={12}
          backgroundColor={BLACK_20}
          onPress={() => navigation.navigate(FAVORITE_EVENTS_SCREEN)}>
          <TemplateIcon
            name="heart"
            size={hp(20)}
            family="Ionicons"
            color={ERROR_RED}
          />
        </TemplateBox>
      ),
      gestureEnabled: false,
    });
  }, [navigation]);

  const today = useMemo(() => new Date(), []);
  const eventsRef = firestore()
    .collection(EVENTS_COLLECTION)
    .where('endDate', '>=', today)
    .orderBy('endDate', 'desc')
    .limit(limit);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await eventsRef
        .get()
        .then(querySnapshot =>
          querySnapshot?.docs?.map(doc => ({id: doc?.id, ...doc?.data()})),
        );
      setEventsData(fetchedEvents);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [limit]);

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
    if (events?.length < 1) return [];
    return search?.length
      ? searchResults?.map(event => ({
          id: event?.id,
          name: event?.title,
          description: event?.description,
          image: event?.image,
          country: event?.country,
          city: event?.city,
          startDate: event?.startDate,
        }))
      : events;
  }, [search, events, searchResults]);

  const renderItem = useCallback(({item}) => {
    const date = new Date(item?.startDate?.seconds * 1000);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return (
      <TemplateBox
        width={WRAPPED_SCREEN_WIDTH}
        mt={12}
        row
        backgroundColor={WHITE}
        height={hp(92)}
        style={SHADOW('mediumCard', WHITE)}
        ph={wp(6)}
        pv={6}
        borderRadius={10}>
        <TemplateBox
          zIndex={99}
          absolute
          width="100%"
          height="200%"
          onPress={() =>
            navigation.navigate(EVENT_DETAILS_SCREEN, {id: item?.id})
          }
        />
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
            <TemplateText size={hp(10)} semiBold mb={0} center>
              {day}
            </TemplateText>
            <TemplateText size={hp(8)} light center style={{lineHeight: 9}}>
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
            <TemplateBox mb={2} >
              <TemplateText size={hp(13)} lineHeight={14.5} numberOfLines={2} semiBold mb={2}>
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
  }, []);

  const ListHeaderComponent = (
    <TemplateBox>
      <TemplateBox
        ml={WRAPPER_MARGIN}
        mt={isAndroid ? 80 : 130}
        alignItems="center"
        justifyContent="center">
        <TemplateText size={18} bold startCase center>
          Explore Events
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
  );

  const ListEmptyComponent = (
    <TemplateBox flex center mt={hp(HEADER_MARGIN)}>
      <TemplateText size={hp(14)} semiBold>
        {search?.length ? 'Event not found' : 'No events available'}
      </TemplateText>
    </TemplateBox>
  );

  return (
    <FlatList
      data={filteredEvents}
      keyExtractor={(item, index) => `${item?.id}-${index}`}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      initialNumToRender={10}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        setLimit(prevLimit => prevLimit + 10);
      }}
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

export default memo(EventsScreen);
