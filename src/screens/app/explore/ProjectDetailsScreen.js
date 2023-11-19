import React, {
    useLayoutEffect, useMemo, useRef,
} from 'react';
import {
    Alert,
    Animated,
    ScrollView, StyleSheet,
} from 'react-native';

import { format } from 'date-fns';
import {
    BLACK,
    BLACK_SECONDARY, DEFAULT_GRADIENT, GREEN,
    WHITE,
    WHITE_40,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
    SCREEN_WIDTH,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import DescriptionRange from './components/DescriptionRange';
import DescriptionRow from './components/DescriptionRow';
import Button from '../../../components/Button';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import {
    ageFilters,
    countryFilters,
    deliveryFormatFilters, genderFilters, languageFilters,
    projectDurationFilters,
    projectFilters, projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { CURRENT_PROJECT_DETAILS } from '../../../navigation/ScreenNames';

const ProjectDetailsScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;

    const { allProjects: projects, enrollToProject } = useProjectsContext();

    const { auth } = useAuthContext();

    const { profile } = auth;

    const selectedProject = useMemo(() => {
        if (!projects) return null;

        return projects?.find(({ id }) => id === projectId);
    }, [projectId, projects]);

    const enrolled = useMemo(() => {
        if (!selectedProject) return false;

        return selectedProject?.applications?.map((app) => app?.creatorId)?.includes(profile?.id);
    }, [selectedProject, profile]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

    const onEnroll = () => {
        if (enrolled) {
            navigation.navigate(CURRENT_PROJECT_DETAILS,
                {
                    projectId,
                    fromProjectDetails: true,
                });
            return;
        }
        enrollToProject(profile?.id, selectedProject);
        Alert.alert(
            'Success',
            'You have successfully enrolled to this project',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ],
            { cancelable: false },
        );
    };

    const pan = useRef(new Animated.ValueXY()).current;

    const buttonCta = useMemo(() => {
        if (enrolled) return 'View Project Status';
        return 'Enroll Now';
    }, [enrolled]);

    if (!selectedProject) return <LoadingOverlay message="Fetching project details..." />;

    const { startDate, endDate } = selectedProject;

    const sDate = new Date();

    const eDate = new Date();

    sDate.setUTCMilliseconds(startDate?.seconds);
    eDate.setUTCMilliseconds(endDate?.seconds);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: pan.y } } }],
                {
                    useNativeDriver: false,
                },
            )}
            contentContainerStyle={styles.contentContainer}
            bounces
        >
            <TemplateBox
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={DEFAULT_GRADIENT}
                style={{
                    transform: [
                        {
                            translateY: pan.y.interpolate({
                                inputRange: [-1000, 0],
                                outputRange: [-200, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            scale: pan.y.interpolate({
                                inputRange: [-3000, 0],
                                outputRange: [20, 1],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={{ uri: selectedProject?.image }}
                    width={SCREEN_WIDTH}
                    style={styles.image}
                />
                <TemplateBox
                    absolute
                    top={(SCREEN_HEIGHT / 3.4)}
                    left={20}
                    pr={20}
                >
                    <TemplateText
                        bold
                        size={18}
                        color={WHITE}
                    >
                        {selectedProject?.title}
                    </TemplateText>
                    <TemplateBox height={10} />
                    <TemplateText
                        size={14}
                        color={WHITE}
                        numberOfLines={2}

                    >
                        {selectedProject?.shortDescription}
                    </TemplateText>
                </TemplateBox>
                {enrolled && (
                    <TemplateBox
                        flex
                        absolute
                        borderRadius={10}
                        backgroundColor={GREEN}
                        height={30}
                        width={74}
                        alignItems="center"
                        justifyContent="center"
                        top={SCREEN_HEIGHT / 2.4 - 44}
                        left={SCREEN_HEIGHT / 2.4 - 46}
                    >
                        <TemplateText bold size={12} color={WHITE}>Enrolled</TemplateText>
                    </TemplateBox>
                )}
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN}>
                <TemplateText
                    style={styles.title}
                    bold
                    size={18}
                    color={BLACK}
                >
                    Description
                </TemplateText>
                <TemplateText
                    color={BLACK}
                    size={14}
                    lineHeight={20}
                >
                    {selectedProject?.description}
                </TemplateText>
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Timeline
                </TemplateText>
                <DescriptionRange
                    icon="timer-outline"
                    maxSubtitle="Start Date"
                    maxTitle={selectedProject?.startDate ? format(sDate, 'dd MMM yyyy') : 'N/A'}
                    minSubtitle="End Date"
                    minTitle={selectedProject?.endDate ? format(eDate, 'dd MMM yyyy') : 'N/A'}
                />
                <TemplateText
                    style={styles.title}
                    boldr
                    size={20}
                    color={BLACK}
                >
                    Price Range
                </TemplateText>
                <DescriptionRange
                    icon="wallet-outline"
                    maxSubtitle="Maximum Budget"
                    maxTitle={`${selectedProject?.priceRange?.max} ${selectedProject?.currency?.symbol}`}
                    minSubtitle="Minimum Budget"
                    minTitle={`${selectedProject?.priceRange?.min} ${selectedProject?.currency?.symbol}`}
                />
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Content Delivery Format
                </TemplateText>
                {selectedProject?.deliveryFormat?.map((format) => (
                    <DescriptionRow
                        key={deliveryFormatFilters?.find(({ value }) => value === format)?.value}
                        title={deliveryFormatFilters?.find(({ value }) => value === format)?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Project Duration
                </TemplateText>
                {selectedProject?.duration?.map((duration) => (
                    <DescriptionRow
                        key={projectDurationFilters?.find(({ value }) => value === duration)?.value}
                        title={projectDurationFilters
                            ?.find(({ value }) => value === duration)
                            ?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Categories
                </TemplateText>
                {selectedProject?.categories?.map((category) => (
                    <DescriptionRow
                        key={projectFilters?.find(({ value }) => value === category)?.value}
                        title={projectFilters?.find(({ value }) => value === category)?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Location
                </TemplateText>
                {selectedProject?.countries?.map((country) => (
                    <DescriptionRow
                        key={countryFilters?.find(({ value }) => value === country)?.value}
                        title={countryFilters?.find(({ value }) => value === country)?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Genders
                </TemplateText>
                {selectedProject?.gender?.map((gender) => (
                    <DescriptionRow
                        key={genderFilters?.find(({ value }) => value === gender)?.value}
                        title={genderFilters?.find(({ value }) => value === gender)?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Content Languages
                </TemplateText>
                {selectedProject?.languages?.map((language) => (
                    <DescriptionRow
                        key={languageFilters?.find(({ value }) => value === language)?.value}
                        title={languageFilters?.find(({ value }) => value === language)?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Age Ranges
                </TemplateText>
                {selectedProject?.ageRange?.map((range) => (
                    <DescriptionRow
                        key={ageFilters?.find(({ value }) => value === range)?.value}
                        title={ageFilters?.find(({ value }) => value === range)?.name}
                    />
                ))}
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Project Type
                </TemplateText>
                {selectedProject?.projectType?.map((type) => (
                    <DescriptionRow
                        key={projectTypeFilters?.find(({ value }) => value === type)?.value}
                        title={projectTypeFilters?.find(({ value }) => value === type)?.name}
                    />
                ))}
            </TemplateBox>

            <Button
                title={buttonCta}
                style={styles.button}
                color={BLACK_SECONDARY}
                onPress={onEnroll}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    image: {
        zIndex: -1,
    },
    title: {
        marginBottom: 10,
        marginTop: WRAPPER_MARGIN * 2,
    },
    button: {
        alignSelf: 'center',
        marginVertical: WRAPPER_MARGIN * 2,
    },
});
export default ProjectDetailsScreen;
