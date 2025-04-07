import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Fuse from 'fuse.js';
import firestore from '@react-native-firebase/firestore';
import {
  HEADER_MARGIN,
  IS_ANDROID,
  SCREEN_WIDTH,
  WRAPPED_SCREEN_WIDTH,
  WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
  ACCENT,
  BLACK,
  DARK_GREY,
  ERROR_RED,
  GREY,
  IOS_BLUE,
  TRANSPARENT,
  WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {SHADOW} from '../../../theme/Shadow';
import {WEBVIEW} from '../../../navigation/ScreenNames';
import {EVENTS_COLLECTION} from '../../../hooks/brands/useEvents';
import {hp, wp} from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import ResizedImage from '../../../components/ResizedImage';
import {months} from '../../../consts/months';
import Button from '../../../components/Button';
import { USERS_COLLECTION } from '../../../hooks/user/useProfile';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const EventDetailsScreen = ({navigation, route}) => {
  const [event, setEvent] = useState(null);
  const { auth } = useAuthContext();
  const { profile, update} = auth;
  const id = route?.params?.id;

  const fetchEvent = async () => {
    try {
      const doc = await firestore().collection(EVENTS_COLLECTION).doc(id).get();
      if (doc.exists) {
        setEvent({id: doc?.id, ...doc?.data()});
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (!event)
    return (
      <TemplateBox flex justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={ACCENT} />
      </TemplateBox>
    );

  const date = new Date(event?.startDate?.seconds * 1000);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[date.getDay()];

  const startDate = new Date(event?.startTime?.seconds * 1000);
  let hours = startDate.getHours();
  const minutes = startDate.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes < 10
  const period = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  const time = !!event?.startTime?.seconds ? `${hours}:${formattedMinutes} ${period}` : null;

  const formattedEndDate = new Date(event?.endDate?.seconds * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric', 
});

  const favEvents = profile?.favoriteEvents
  const isFavEvent = favEvents?.includes(event?.eventId)

  const updateProfile = async (data, id) => {
    try {
        await firestore()
            .collection(USERS_COLLECTION)
            .doc(id)
            .set({
                ...data,
            }, { merge: true });
        console.log("profile updated successfully")
    } catch (e) {
        console.log("error updating profile:", e);
    }
};

  const onFavPress = async () => {
    if (!profile) return;
    if (favEvents?.length > 0 && favEvents.includes(event?.eventId)) {
      await updateProfile({...profile,  favoriteEvents: favEvents.filter((id) => id !== event?.eventId)}, profile?.id)
      update('favoriteEvents', favEvents?.filter((id)=> id !== event?.eventId ))
    } else {
      await updateProfile({...profile,  favoriteEvents: [...new Set([...(profile?.favoriteEvents || []), event?.eventId])]}, profile?.id)
      update('favoriteEvents', [...new Set([...(profile?.favoriteEvents || []), event?.eventId])])
    }
};



  return (
    <TemplateBox flex backgroundColor={WHITE} >
      <ScrollView>
        <TemplateBox
          mt={HEADER_MARGIN * 0.8}
          mb={hp(16)}
          borderRadius={hp(16)}
          overflow="hidden"
          backgroundColor={WHITE}
          ph={WRAPPER_MARGIN}>
          <TemplateBox
            width={WRAPPED_SCREEN_WIDTH}
            aspectRatio={1}
            backgroundColor={GREY}
            borderRadius={hp(16)}
            overflow="hidden"
            >
            <TemplateBox absolute left={20} top={20} height={50} width={50} justifyContent='center' alignItems='center' borderRadius={12} selfCenter zIndex={99} style={SHADOW('mediumCard', WHITE)}
              onPress={onFavPress}
              >
              <TemplateIcon
                name="heart"
                size={hp(25)}
                family="Ionicons"
                color={isFavEvent ? ERROR_RED : GREY}
              />
            </TemplateBox>
            <ResizedImage
              source={{uri: event?.image}}
              style={{height: '100%', width: '100%'}}
            />
          </TemplateBox>

          <TemplateBox mt={hp(16)}>
            <TemplateText semiBold size={hp(16)}>
              {event?.title}
            </TemplateText>
          </TemplateBox>

          {!!event?.country && <TemplateBox row center mt={hp(4)}>
            <TemplateIcon
              name="location-sharp"
              size={hp(11)}
              family="Ionicons"
              color={DARK_GREY}
              style={{marginRight: 3, marginTop: 3}}
            />
            <TemplateText medium size={hp(14)} color={DARK_GREY}>
            {`${event?.city}, ${event?.country}`}
            </TemplateText>
          </TemplateBox>}

          <TemplateBox row hCenter mt={hp(16)}>
            <TemplateBox mr={wp(16)} alignItems="center">
              <TemplateText medium size={hp(14)}>
                {day}
              </TemplateText>
              <TemplateText size={hp(12)} color={DARK_GREY} style={{marginTop: 2}}>
                {month}
              </TemplateText>
            </TemplateBox>
            <TemplateBox>
              <TemplateText medium size={hp(14)}>
                {dayOfWeek}
              </TemplateText>
             {!!time && <TemplateText size={hp(12)} style={{marginTop: 2}} color={DARK_GREY}>
                {time}
              </TemplateText>}
            </TemplateBox>
          </TemplateBox>

          <TemplateBox mt={hp(16)}>
            <TemplateText size={hp(14)}>{event?.description}</TemplateText>
          </TemplateBox>
          <TemplateBox mt={hp(16)}>
            <TemplateText size={hp(12)} color={DARK_GREY}>{`End date: ${formattedEndDate}`}</TemplateText>
          </TemplateBox>
        </TemplateBox>
      </ScrollView>

      {!!event?.link && (
        <Button
          title="View More"
          onPress={() => navigation.navigate(WEBVIEW, {url: event?.link})}
          style={styles.button}
          loading={false}
        />
      )}
    </TemplateBox>
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
  button: {
    marginVertical: 40,
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: IOS_BLUE,
    width: WRAPPED_SCREEN_WIDTH,
},
});

export default EventDetailsScreen;
