import React, {
    FC, useLayoutEffect, useMemo, useState
} from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';

import {
    BLACK,
    BLACK_30, BLACK_50, BLACK_SECONDARY,
    WHITE, WHITE_40
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import { PROJECTS } from '../../../consts/content/Home';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import DescriptionRange from './components/DescriptionRange';
import DescriptionRow from './components/DescriptionRow';
import Button from '../../../components/Button';

interface ProjectDetailsScreenProps {
    route: any;
    navigation: any;
}
const ProjectDetailsScreen:FC<ProjectDetailsScreenProps> = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;

    const selectedProject = useMemo(() => {
        if (!PROJECTS) return null;

        return PROJECTS?.find(({ id }) => id === projectId);
    }, [projectId, PROJECTS]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            )
        });
    }, [navigation]);

    if (!selectedProject) return <LoadingOverlay message="Fetching project details..." />;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            bouncesZoom
            bounces={false}
        >
            <TemplateBox
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={[BLACK_30, BLACK_30]}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={selectedProject?.image}
                    width="100%"
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
                        size={24}
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
                    color={BLACK_50}
                    size={16}
                    lineHeight={22}
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
                    maxTitle={selectedProject?.startDate}
                    minSubtitle="End Date"
                    minTitle={selectedProject?.endDate}
                />
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Price Range
                </TemplateText>
                <DescriptionRange
                    icon="wallet-outline"
                    maxSubtitle="Maximum Budget"
                    maxTitle={`${selectedProject?.priceRange?.max} ${selectedProject?.currency}`}
                    minSubtitle="Minimum Budget"
                    minTitle={`${selectedProject?.priceRange?.min} ${selectedProject?.currency}`}
                />
                <TemplateText
                    style={styles.title}
                    bold
                    size={20}
                    color={BLACK}
                >
                    Content Delivery Format
                </TemplateText>
                {selectedProject?.deliverFormat?.map((format) => (
                    <DescriptionRow
                        key={format?.value}
                        title={format?.name}
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
                        key={duration?.value}
                        title={duration?.name}
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
                        key={category?.value}
                        title={category?.name}
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
                        key={country?.value}
                        title={country?.name}
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
                        key={gender?.value}
                        title={gender?.name}
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
                        key={language?.value}
                        title={language?.name}
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
                        key={range?.value}
                        title={range?.name}
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
                        key={type?.value}
                        title={type?.name}
                    />
                ))}
            </TemplateBox>

            <Button title="Enroll Now" style={styles.button} color={BLACK_SECONDARY} />
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
        marginTop: WRAPPER_MARGIN * 2
    },
    button: {
        alignSelf: 'center',
        marginVertical: WRAPPER_MARGIN * 2
    }
});
export default ProjectDetailsScreen;
