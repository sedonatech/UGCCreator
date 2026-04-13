import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { getFirestore, collection, doc, getDoc } from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { HEADER_MARGIN, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import { ACCENT, DARK_GREY, GREY, IOS_BLUE, LAVENDER, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { ADD_EVENT, WEBVIEW } from '../../../navigation/ScreenNames';
import { EVENTS_COLLECTION } from '../../../hooks/brands/useEvents';
import { hp, wp } from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import ResizedImage from '../../../components/ResizedImage';
import { months } from '../../../consts/months';
import safeToDate from '../../../Utils/safeToDate';
import Button from '../../../components/Button';

import HeaderIconButton from '../../../components/header/HeaderButton';

const BrandEventDetailsScreen = ({ navigation, route }) => {
    const [event, setEvent] = useState(null);

    const id = route?.params?.id;

    const fetchEvent = async () => {
        try {
            const db = getFirestore();
            const eventDocRef = doc(collection(db, EVENTS_COLLECTION), id);
            const eventDoc = await getDoc(eventDocRef);
            if (eventDoc.exists) {
                setEvent({ id: eventDoc.id, ...eventDoc.data() });
            }
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvent();
            return () => {};
        }, [id]),
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    name="pencil"
                    onPress={() => navigation.navigate(ADD_EVENT, { event })}
                    backDropColor={LAVENDER}
                    mr={WRAPPER_MARGIN}
                />
            ),
            gestureEnabled: false,
        });
    }, [navigation, event]);

    if (!event) {
        return (
            <TemplateBox flex justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" color={ACCENT} />
            </TemplateBox>
        );
    }

    const date = safeToDate(event?.startDate) || new Date();
    const day = date.getDate();
    const month = months[date.getMonth()];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    const startDateObj = safeToDate(event?.startTime) || new Date();
    let hours = startDateObj.getHours();
    const minutes = startDateObj.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes < 10
    const period = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    const time = `${hours}:${formattedMinutes} ${period}`;

    const endDateObj = safeToDate(event?.endDate) || new Date();
    const formattedEndDate = endDateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <TemplateBox flex backgroundColor={WHITE}>
            <ScrollView>
                <TemplateBox mt={HEADER_MARGIN * 0.8} mb={hp(16)} backgroundColor={WHITE} ph={WRAPPER_MARGIN}>
                    <TemplateBox
                        width={WRAPPED_SCREEN_WIDTH}
                        height={hp(220)}
                        backgroundColor={GREY}
                        borderRadius={hp(16)}
                        overflow="hidden"
                    >
                        <ResizedImage source={{ uri: event?.image }} style={styles.eventImage} />
                    </TemplateBox>

                    <TemplateBox mt={hp(16)}>
                        <TemplateText semiBold size={hp(20)}>
                            {event?.title}
                        </TemplateText>
                    </TemplateBox>

                    {!!event?.country && (
                        <TemplateBox row alignItems="center" mt={hp(8)}>
                            <TemplateIcon
                                name="location-sharp"
                                size={hp(14)}
                                family="Ionicons"
                                color={DARK_GREY}
                                style={styles.locationIcon}
                            />
                            <TemplateText medium size={hp(14)} color={DARK_GREY}>
                                {`${event?.city}, ${event?.country}`}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    <TemplateBox row alignItems="center" mt={hp(16)}>
                        <TemplateBox mr={wp(16)}>
                            <TemplateText medium size={hp(14)}>
                                {day} {month}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox>
                            <TemplateText medium size={hp(14)}>
                                {dayOfWeek}
                                {time ? `, ${time}` : ''}
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>

                    <TemplateBox mt={hp(8)}>
                        <TemplateText size={hp(12)} color={DARK_GREY}>{`Ends ${formattedEndDate}`}</TemplateText>
                    </TemplateBox>

                    <TemplateBox mt={hp(16)}>
                        <TemplateText size={hp(14)} lineHeight={hp(22)} color={DARK_GREY}>
                            {event?.description}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </ScrollView>

            {!!event?.link && (
                <Button
                    title="View More"
                    onPress={() => navigation.navigate(WEBVIEW, { url: event?.link })}
                    style={styles.button}
                    loading={false}
                />
            )}
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
        width: WRAPPED_SCREEN_WIDTH,
    },
    eventImage: {
        height: '100%',
        width: '100%',
    },
    locationIcon: {
        marginRight: 3,
        marginTop: 3,
    },
});

export default BrandEventDetailsScreen;
