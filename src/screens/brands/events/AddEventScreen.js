import React, {useEffect, useMemo} from 'react';
import {Alert, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FastImage from 'react-native-fast-image';
import {uniq} from 'lodash';
import {
  BLACK,
  BLACK_40,
  DEEP_PURPLE,
  GREY,
  GREY_SECONDARY,
  TRANSPARENT,
  WHITE,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
  HEADER_MARGIN,
  IS_ANDROID,
  SCREEN_WIDTH,
  SPACE_LARGE,
  SPACE_SMALL,
  SPACE_XXLARGE,
  WRAPPED_SCREEN_WIDTH,
  WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import Button from '../../../components/Button';
import TemplateBox from '../../../components/TemplateBox';
import Wrapper from '../../../components/Wrapper';
import {
  projectFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../../app/explore/components/FilterCategory';
import AddButtonLargeSvg from '../../../../assets/svgs/AddButtonLargeSvg';
import useImageStorage from '../../../hooks/Portfolio/useImageStorage';
import {hp, wp} from '../../../Utils/getResponsiveSize';
import useCountries from '../../../hooks/useCountries';
import DropdownSearch from '../../app/explore/components/DropdownSearch';
import useEvents from '../../../hooks/brands/useEvents';

const convertTimestampToDate = (timestamp) => {
  if (timestamp.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000);
  }
  return timestamp;
};

const AddEventScreen = ({navigation, route}) => {
  const {update, event, createEvent, loading, updateEvent, setEvent} = useEvents();
  const eventData = route?.params?.event

  useEffect(()=> {
    if(!!eventData)loadEvent()
  },[eventData])

  const loadEvent = () => {
    const updatedData = {};
    for (const [key, value] of Object.entries(eventData)) {
      updatedData[key] = typeof value === 'object' && value !== null && value.seconds !== undefined
        ? convertTimestampToDate(value)
        : value;
    }
    setEvent(updatedData)
  }
  const {onAddImage: onAddPhoto, images} = useImageStorage();
  const latestImage = useMemo(() => {
    if (!images) return null;
    const sortedImages = images
      ?.filter(item => !!item?.contentDisposition)
      .sort((a, b) => b?.generation - a?.generation);

    return sortedImages[0];
  }, [images]);

  useEffect(() => {
    if (latestImage) {
      update('image', latestImage?.url);
    }

    if(eventData) update('image', eventData?.image);
  }, [latestImage]);

  const getUnfilledFields = () => {
    const {image, title, startDate, endDate, description} = event;
    const unfilledFields = [];
    if (!image?.length) unfilledFields.push('image');
    if (!title?.length) unfilledFields.push('title');
    if (!startDate) unfilledFields.push('startDate');
    if (!endDate) unfilledFields.push('endDate');
    if (!description?.length) unfilledFields.push('description');
    return unfilledFields?.join(', ');
  };

  const handleCreateEvent = () => {
    const {image, title, startDate, endDate, description} = event;
    console.log({image, title, startDate, endDate, description})
    if (
      !image?.length ||
      !title?.length ||
      !startDate ||
      !endDate ||
      !description?.length
    )return Alert.alert('Please fill all required fields:', getUnfilledFields());

    if(!!eventData){
      updateEvent(eventData?.id, event);
    }else {
      createEvent(event);
    }
   
    Alert.alert('Event created successfully',
        'You can view your event in the events section',
        [
            {
                text: 'OK',
                onPress: () => navigation.goBack(),
            },
        ]);
  };

  const {countries, cities} = useCountries(event?.country);

  return (
    <Wrapper
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
      keyboard
      safe={false}>
      <TemplateBox height={HEADER_MARGIN * 0.7} />
      <TemplateBox mv={WRAPPER_MARGIN} width={WRAPPED_SCREEN_WIDTH}>
        <TemplateText bold color={BLACK} size={18} startCase>
          Add an event
        </TemplateText>
      </TemplateBox>

      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_LARGE}>
        <TemplateText size={16}>
          Event Title
          <TemplateText size={12} ml={10} color={GREY}>
            {`  <Required>`}
          </TemplateText>
        </TemplateText>
        <TemplateTextInput
          placeholder="Event Title"
          placeholderTextColor={BLACK_40}
          style={styles.input}
          value={event?.title}
          onChangeText={text => update('title', text)}
          autoCapitalize="none"
        />
      </TemplateBox>
      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_LARGE}>
        <TemplateText size={16}>
          Description
          <TemplateText size={12} ml={10} color={GREY}>
            {`  <Required>`}
          </TemplateText>
        </TemplateText>
        <TemplateTextInput
          placeholder="Description"
          placeholderTextColor={BLACK_40}
          style={[styles.input, {height: 80}]}
          value={event?.description}
          onChangeText={text => update('description', text)}
          autoCapitalize="none"
          multiline
          numberOfLines={6}
          maxLength={500}
        />
      </TemplateBox>

      <DropdownSearch
        title={event?.country || 'Country'}
        filters={uniq(countries)?.map(country => ({
          name: country,
          value: country,
        }))}
        onFilterPress={value => {
          update('country', value);
          update('city', null);
        }}
        selectedFilter={event?.countries}
      />
      <TemplateBox mb={SPACE_SMALL} width={SPACE_XXLARGE} />
      <DropdownSearch
        title={event?.city || 'City'}
        filters={uniq(cities)?.map(country => ({
          name: country,
          value: country,
        }))}
        onFilterPress={value => {
          update('city', value);
        }}
        selectedFilter={event?.countries}
      />
      <TemplateBox mb={SPACE_SMALL} width={SPACE_XXLARGE} />

      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE} selfCenter>
        <TemplateText size={16}>
          Start Date
          <TemplateText size={12} ml={10} color={GREY}>
            {`  <Required>`}
          </TemplateText>
        </TemplateText>
        <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} selfCenter>
          <DateTimePicker
            value={event?.startDate || new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || event?.startDate;
              update('startDate', currentDate);
            }}
            textColor={BLACK_40}
            themeVariant="light"
          />
        </TemplateBox>
      </TemplateBox>

      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_LARGE} selfCenter>
        <TemplateText size={16}>
          End Date
          <TemplateText size={12} ml={10} color={GREY}>
            {`  <Required>`}
          </TemplateText>
        </TemplateText>
        <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} selfCenter>
          <DateTimePicker
            value={event?.endDate || new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || event?.endDate;
              update('endDate', currentDate);
            }}
            textColor={BLACK_40}
            themeVariant="light"
          />
        </TemplateBox>
      </TemplateBox>

      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_LARGE} selfCenter>
        <TemplateText size={16}>
          Start Time
          <TemplateText size={12} ml={10} color={GREY}>
            {`  <Required>`}
          </TemplateText>
        </TemplateText>
        <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} mt={hp(8)}>
          <DateTimePicker
            value={event?.startTime || new Date()}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || event?.startTime;
              update('startTime', currentDate);
            }}
            textColor={BLACK_40}
            themeVariant="light"
          />
        </TemplateBox>
      </TemplateBox>

      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
        <TemplateText size={16}>
          Image
          <TemplateText size={12} ml={10} color={GREY}>
            {`  <Required>`}
          </TemplateText>
        </TemplateText>
        <TemplateBox height={10} />
        {event?.image && (
          <TemplateBox
            aspectRatio={1}
            width={WRAPPED_SCREEN_WIDTH}
            borderRadius={10}
            mb={10}>
            <FastImage source={{uri: event?.image}} style={styles.image} />
          </TemplateBox>
        )}

        <TemplateBox
          onPress={() => {
            if (event?.image) {
              Alert.alert('Are you sure you want to replace the image?', '', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => onAddPhoto(),
                },
              ]);
              return;
            }
            onAddPhoto();
          }}>
          <AddButtonLargeSvg width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} />
        </TemplateBox>
      </TemplateBox>

      <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
        <TemplateText size={16}>Event Link</TemplateText>
        <TemplateTextInput
          placeholder="https://www..."
          placeholderTextColor={BLACK_40}
          style={styles.input}
          value={event?.link}
          onChangeText={text => update('link', text)}
          autoCapitalize="none"
        />
      </TemplateBox>

      <FilterCategory
        title="Event Categories"
        filters={projectFilters}
        onFilterPress={value => {
          if (event?.categories.includes(value)) {
            const newProjectCategories = event?.categories.filter(
              item => item !== value,
            );
            return update('categories', newProjectCategories);
          }
          update('categories', [...event?.categories, value]);
        }}
        selectedFilters={event?.categories}
      />

      <Button
        title={!!eventData ? "Edit Event" : "Create Event"}
        onPress={handleCreateEvent}
        style={styles.button}
        loading={loading}
        disabled={false}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    paddingBottom: SPACE_XXLARGE,
  },
  contentContainer: {
    backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
  },
  input: {
    height: 45,
    borderWidth: 1,
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
    borderColor: GREY_SECONDARY,
    borderRadius: 10,
    paddingLeft: 16,
    marginTop: 10,
    color: DEEP_PURPLE,
  },
  longInput: {
    height: 70,
    borderWidth: 1,
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
    borderColor: GREY_SECONDARY,
    borderRadius: 10,
    paddingLeft: 16,
    marginTop: 10,
    color: DEEP_PURPLE,
  },
  button: {
    marginTop: 20,
    marginBottom: 50,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: wp(10),
  },
});
export default AddEventScreen;
