import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {
  SCREEN_WIDTH,
  WRAPPED_SCREEN_WIDTH,
  WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import {
  SHADOW,
} from '../../../../theme/Shadow';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
  DARK_GREY,
  GREY,
  IOS_BLUE,
  WHITE,
} from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { EVENT_DETAILS_SCREEN, EVENTS_SCREEN} from '../../../../navigation/ScreenNames';
import {EVENTS_COLLECTION} from '../../../../hooks/brands/useEvents';
import {hp, wp} from '../../../../Utils/getResponsiveSize';
import ResizedImage from '../../../../components/ResizedImage';
import { months } from '../../../../consts/months';
import TemplateIcon from '../../../../components/TemplateIcon';

const EventsCarousel = ({style}) => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const today = useMemo(() => new Date(), []);

  const eventsRef = firestore()
    .collection(EVENTS_COLLECTION)
    .where('endDate', '>=', today)
    .orderBy('endDate', 'desc')
    .limit(5);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await eventsRef
        .get()
        .then(querySnapshot => querySnapshot?.docs?.map(doc => ({ id: doc?.id, ...doc?.data() })));
        
      setEvents(fetchedEvents);
    } catch (e) {
      console.log(e);
    }
  };

  const eventsData = useMemo(() => {
    if (!events?.length) {
      return [];
    }
    return events?.map(event => ({
      id: event?.id,
      name: event?.title,
      description: event?.description,
      image: event?.image,
      country: event?.country,
      city: event?.city,
      startDate: event?.startDate,
    }))?.sort((a, b)=> a?.startDate?.seconds - b?.startDate?.seconds );
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, []);

  if(!eventsData?.length) return <TemplateBox width={SCREEN_WIDTH} height={hp(35)} />

  return (
    <TemplateBox style={style} mt={hp(30)} mb={hp(25)} height={145} >
      <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} >
        <TemplateText size={18} bold>
          Brand Events
        </TemplateText>
        <TemplateBox flex />
        <TemplateTouchable onPress={() => navigation.navigate(EVENTS_SCREEN)}>
          <TemplateText startCase size={14} underLine color={IOS_BLUE}>
            See All
          </TemplateText>
        </TemplateTouchable>
      </TemplateBox>

      <TemplateCarousel
        data={eventsData}
        renderItem={({item}) => {
            const date = new Date(item?.startDate?.seconds * 1000);
            const day = date.getDate();
            const month = months[date.getMonth()];
            return (
          <TemplateBox
           
            width={WRAPPED_SCREEN_WIDTH - 60}
            mt={16}
            mr={8}
            row
            backgroundColor={WHITE}
            height={hp(92)}
            style={SHADOW('mediumCard', WHITE)}
            ph={wp(6)}
            pv={6}
            borderRadius={10}
            >
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

              <TemplateBox zIndex={1} absolute top={8} left={8} backgroundColor={WHITE} width={25} height={25} justifyContent='center' alignItems='center' borderRadius={4}>
                <TemplateText size={hp(10)} semiBold center>
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
              <TemplateBox mb={2}>
                <TemplateBox mb={2}>
                  <TemplateText size={hp(13)} lineHeight={14.5} semiBold mb={2} numberOfLines={2}>
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
        )}}
        contentContainerStyle={styles.cardCarousel}
        snapToInterval={WRAPPED_SCREEN_WIDTH - 60}
        keyExtractor={(item)=> item?.id}
      />
    </TemplateBox>
  );
};

const styles = StyleSheet.create({
  cardCarousel: {
    paddingHorizontal: WRAPPER_MARGIN,
  },
  subtitle: {
    marginLeft: WRAPPER_MARGIN,
    marginBottom: 10,
  },
});

EventsCarousel.propTypes = {
  style: PropTypes.shape({}),
};

EventsCarousel.defaultProps = {
  style: {},
};
export default EventsCarousel;
