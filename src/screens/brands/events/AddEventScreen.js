/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FastImage from 'react-native-fast-image';
import { uniq } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
    BLACK,
    BLACK_40,
    BLACK_60,
    BLUE,
    DEEP_PURPLE,
    GREY,
    GREY_SECONDARY,
    LAVENDER,
    TRANSPARENT,
    WHITE,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    RADIUS_SMALL,
    SCREEN_WIDTH,
    SPACE_LARGE,
    SPACE_MEDIUM,
    SPACE_SMALL,
    SPACE_XXLARGE,
    WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import Button from '../../../components/Button';
import TemplateBox from '../../../components/TemplateBox';
import Wrapper from '../../../components/Wrapper';
import { eventCategoryFilters } from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../../app/explore/components/FilterCategory';
import TemplateIcon from '../../../components/TemplateIcon';
import useImageStorage from '../../../hooks/Portfolio/useImageStorage';
import { hp } from '../../../Utils/getResponsiveSize';
import useCountries from '../../../hooks/useCountries';
import DropdownSearch from '../../app/explore/components/DropdownSearch';
import useEvents from '../../../hooks/brands/useEvents';

import safeToDate from '../../../Utils/safeToDate';

const AddEventScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { update, event, createEvent, loading, updateEvent, setEvent } = useEvents();
    const eventData = route?.params?.event;

    const [showStartDate, setShowStartDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [updateImage, setUpdateImage] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (eventData) loadEvent();
    }, [eventData]);

    const loadEvent = () => {
        const updatedData = {};
        const dateFields = ['startDate', 'startTime'];
        for (const [key, value] of Object.entries(eventData)) {
            if (dateFields.includes(key)) {
                updatedData[key] = safeToDate(value) || new Date();
            } else {
                updatedData[key] = value;
            }
        }
        setEvent(updatedData);
    };

    const formatDate = (date, options) => {
        const d = date instanceof Date ? date : safeToDate(date);
        if (!d) return '';
        return d.toLocaleDateString(t('common.localeCode'), options);
    };

    const formatTime = (date, options) => {
        const d = date instanceof Date ? date : safeToDate(date);
        if (!d) return '';
        return d.toLocaleTimeString(t('common.localeCode'), options);
    };
    const { onAddImage: onAddPhoto, images } = useImageStorage({ subfolder: 'events' });
    const latestImage = useMemo(() => {
        if (!images) return null;
        const sortedImages = images
            ?.filter(item => !!item?.contentDisposition)
            .sort((a, b) => b?.generation - a?.generation);

        return sortedImages[0];
    }, [images]);

    useEffect(() => {
        if (latestImage) {
            // fixes the issue where you're trying to edit an event
            // and latest image has higher generation value than previous event
            if (eventData && !updateImage) return;
            update('image', latestImage?.url);
            setImageLoading(false);
            return;
        }

        if (eventData) update('image', eventData?.image);
    }, [latestImage]);

    const getUnfilledFields = () => {
        const { image, title, startDate, description } = event;
        const unfilledFields = [];
        if (!image?.length) unfilledFields.push('image');
        if (!title?.trim()?.length) unfilledFields.push('title');
        if (!startDate) unfilledFields.push('startDate');
        if (!description?.trim()?.length) unfilledFields.push('description');
        return unfilledFields?.join(', ');
    };

    const handleCreateEvent = () => {
        const { image, title, startDate, description } = event;
        if (!image?.length || !title?.trim()?.length || !startDate || !description?.trim()?.length)
            return Alert.alert(t('common.alerts.fillRequiredFields'), getUnfilledFields());

        if (eventData) {
            updateEvent(eventData?.id, event);
        } else {
            createEvent(event);
        }

        Alert.alert(
            t('events.alerts.successTitle', {
                action: eventData ? t('events.alerts.edited') : t('events.alerts.created'),
            }),
            t('events.alerts.successMessage'),
            [
                {
                    text: t('common.buttons.ok'),
                    onPress: () => navigation.goBack(),
                },
            ],
        );
    };

    const { countries, cities } = useCountries(event?.country);

    return (
        <Wrapper contentContainerStyle={styles.contentContainer} style={styles.container} keyboard safe={false}>
            <TemplateBox height={HEADER_MARGIN * 0.7} />
            <TemplateBox mv={WRAPPER_MARGIN} width={WRAPPED_SCREEN_WIDTH}>
                <TemplateText bold color={BLACK} size={18} startCase>
                    {eventData ? t('brands.events.addEvent.editTitle') : t('brands.events.addEvent.title')}
                </TemplateText>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_LARGE}>
                <TemplateText size={16}>
                    {t('brands.events.addEvent.fields.eventTitle')}
                    <TemplateText size={12} ml={10} color={GREY}>
                        {t('brands.events.addEvent.required')}
                    </TemplateText>
                </TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.events.addEvent.placeholders.title')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={event?.title}
                    onChangeText={text => update('title', text)}
                    autoCapitalize="none"
                />
            </TemplateBox>
            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_LARGE}>
                <TemplateText size={16}>
                    {t('brands.events.addEvent.fields.description')}
                    <TemplateText size={12} ml={10} color={GREY}>
                        {t('brands.events.addEvent.required')}
                    </TemplateText>
                </TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.events.addEvent.placeholders.description')}
                    placeholderTextColor={BLACK_40}
                    style={[styles.input, { height: 80 }]}
                    value={event?.description}
                    onChangeText={text => update('description', text)}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={6}
                    maxLength={500}
                />
            </TemplateBox>

            <DropdownSearch
                title={event?.country || t('brands.events.addEvent.fields.country')}
                filters={uniq(countries)?.map(country => ({
                    name: country,
                    value: country,
                }))}
                onFilterPress={value => {
                    update('country', value);
                    update('city', null);
                }}
                selectedFilters={event?.country ? [event.country] : []}
            />
            <TemplateBox mb={SPACE_SMALL} width={SPACE_XXLARGE} />
            <DropdownSearch
                title={event?.city || t('brands.events.addEvent.fields.city')}
                filters={uniq(cities)?.map(city => ({
                    name: city,
                    value: city,
                }))}
                onFilterPress={value => {
                    update('city', value);
                }}
                selectedFilters={event?.city ? [event.city] : []}
            />
            <TemplateBox mb={SPACE_SMALL} width={SPACE_XXLARGE} />

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_SMALL} selfCenter>
                <TemplateText size={16}>
                    {t('brands.events.addEvent.fields.startDate')}
                    <TemplateText size={12} ml={10} color={GREY}>
                        {t('brands.events.addEvent.required')}
                    </TemplateText>
                </TemplateText>
                <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} selfCenter>
                    {showStartDate ? (
                        <>
                            <DateTimePicker
                                value={event?.startDate instanceof Date ? event.startDate : new Date()}
                                mode="date"
                                display="spinner"
                                onChange={(e, selectedDate) => {
                                    const currentDate = selectedDate || event?.startDate;
                                    update('startDate', currentDate);
                                    if (IS_ANDROID) setShowStartDate(false);
                                }}
                                textColor={BLACK}
                                themeVariant="light"
                                minimumDate={new Date()}
                            />
                            {!IS_ANDROID && (
                                <TemplateBox
                                    onPress={() => setShowStartDate(false)}
                                    pAll={SPACE_SMALL}
                                    backgroundColor={DEEP_PURPLE}
                                    borderRadius={RADIUS_SMALL}
                                    alignItems="center"
                                    selfCenter
                                    width={WRAPPED_SCREEN_WIDTH}
                                >
                                    <TemplateText color={WHITE} semiBold>
                                        {t('common.actions.done')}
                                    </TemplateText>
                                </TemplateBox>
                            )}
                        </>
                    ) : (
                        <TemplateBox
                            row
                            alignItems="center"
                            justifyContent="space-between"
                            pAll={SPACE_MEDIUM}
                            width={WRAPPED_SCREEN_WIDTH}
                            borderRadius={RADIUS_SMALL}
                            backgroundColor={LAVENDER}
                            mv={SPACE_SMALL}
                            selfCenter
                            onPress={() => setShowStartDate(true)}
                        >
                            <TemplateText>
                                {event?.startDate
                                    ? formatDate(event.startDate, { year: 'numeric', month: 'long', day: 'numeric' })
                                    : t('brands.events.addEvent.placeholders.selectStartDate')}
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_SMALL} selfCenter>
                <TemplateText size={16}>
                    {t('brands.events.addEvent.fields.startTime')}
                    <TemplateText size={12} ml={10} color={GREY}>
                        {t('brands.events.addEvent.required')}
                    </TemplateText>
                </TemplateText>
                <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} mt={hp(8)}>
                    {showStartTime ? (
                        <>
                            <DateTimePicker
                                value={event?.startTime instanceof Date ? event.startTime : new Date()}
                                mode="time"
                                is24Hour
                                display="spinner"
                                onChange={(e, selectedDate) => {
                                    const currentDate = selectedDate || event?.startTime;
                                    update('startTime', currentDate);
                                    if (IS_ANDROID) setShowStartTime(false);
                                }}
                                textColor={BLACK}
                                themeVariant="light"
                            />
                            {!IS_ANDROID && (
                                <TemplateBox
                                    onPress={() => setShowStartTime(false)}
                                    pAll={SPACE_SMALL}
                                    backgroundColor={DEEP_PURPLE}
                                    borderRadius={RADIUS_SMALL}
                                    alignItems="center"
                                    selfCenter
                                    width={WRAPPED_SCREEN_WIDTH}
                                >
                                    <TemplateText color={WHITE} semiBold>
                                        {t('common.actions.done')}
                                    </TemplateText>
                                </TemplateBox>
                            )}
                        </>
                    ) : (
                        <TemplateBox
                            row
                            alignItems="center"
                            justifyContent="space-between"
                            pAll={SPACE_MEDIUM}
                            width={WRAPPED_SCREEN_WIDTH}
                            borderRadius={RADIUS_SMALL}
                            backgroundColor={LAVENDER}
                            mv={SPACE_SMALL}
                            selfCenter
                            onPress={() => setShowStartTime(true)}
                        >
                            <TemplateText>
                                {event?.startTime
                                    ? formatTime(event.startTime, { hour: '2-digit', minute: '2-digit' })
                                    : t('brands.events.addEvent.placeholders.selectStartTime')}
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateBox row alignItems="center">
                    <TemplateText size={16}>
                        {t('brands.events.addEvent.fields.image')}
                        <TemplateText size={12} ml={10} color={GREY}>
                            {t('brands.events.addEvent.required')}
                        </TemplateText>
                    </TemplateText>
                    {imageLoading && <ActivityIndicator size="small" color={BLUE} style={styles.imageLoader} />}
                </TemplateBox>
                <TemplateBox height={10} />
                <TemplateBox
                    width={WRAPPED_SCREEN_WIDTH}
                    borderRadius={12}
                    overflow="hidden"
                    onPress={() => {
                        if (event?.image) {
                            Alert.alert(t('common.alerts.replaceImage.message'), '', [
                                {
                                    text: t('common.actions.cancel'),
                                    style: 'cancel',
                                },
                                {
                                    text: t('common.buttons.ok'),
                                    onPress: () => {
                                        setImageLoading(true);
                                        setUpdateImage(true);
                                        onAddPhoto();
                                    },
                                },
                            ]);
                        } else {
                            setImageLoading(true);
                            onAddPhoto();
                        }
                    }}
                >
                    {event?.image ? (
                        <TemplateBox>
                            <FastImage
                                source={{ uri: event?.image }}
                                style={styles.eventCoverImage}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <TemplateBox style={styles.imageOverlay} row alignItems="center" justifyContent="center">
                                <TemplateIcon name="camera-outline" size={18} color={WHITE} />
                                <TemplateBox width={6} />
                                <TemplateText size={14} color={WHITE} semiBold>
                                    {t('brands.events.addEvent.buttons.replaceImage')}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    ) : (
                        <TemplateBox style={styles.imagePlaceholder} alignItems="center" justifyContent="center">
                            <TemplateIcon name="camera-outline" size={36} color={GREY} />
                            <TemplateBox height={8} />
                            <TemplateText size={15} color={BLACK} semiBold>
                                {t('brands.events.addEvent.buttons.addImage')}
                            </TemplateText>
                            <TemplateText size={12} color={GREY} mt={4}>
                                {t('brands.events.addEvent.buttons.tapToUpload')}
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.events.addEvent.fields.eventLink')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.events.addEvent.placeholders.link')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={event?.link}
                    onChangeText={text => update('link', text)}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <FilterCategory
                title={t('brands.events.addEvent.categories')}
                filters={eventCategoryFilters}
                onFilterPress={value => {
                    if (event?.categories?.includes(value)) {
                        const newCategories = event?.categories?.filter(item => item !== value);
                        return update('categories', newCategories);
                    }
                    update('categories', [...(event?.categories || []), value]);
                }}
                selectedFilters={event?.categories || []}
                translationPrefix="eventCategories"
            />

            <Button
                title={
                    eventData ? t('brands.events.addEvent.buttons.edit') : t('brands.events.addEvent.buttons.create')
                }
                onPress={handleCreateEvent}
                style={styles.button}
                loading={loading}
                disabled={false}
                height={50}
                width={SCREEN_WIDTH - 40}
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

    button: {
        marginTop: 20,
        marginBottom: 50,
        alignSelf: 'center',
    },
    eventCoverImage: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: BLACK_60,
        paddingVertical: 10,
    },
    imagePlaceholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderWidth: 1.5,
        borderColor: GREY_SECONDARY,
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: LAVENDER,
    },
    imageLoader: {
        marginLeft: 8,
    },
});
export default AddEventScreen;
