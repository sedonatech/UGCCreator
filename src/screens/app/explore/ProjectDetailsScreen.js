/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { Alert, Linking, ScrollView, StyleSheet } from 'react-native';

import useTranslation from '../../../hooks/useTranslation';
import { BLACK, BLACK_SECONDARY, DEFAULT_GRADIENT, GREEN, WHITE, WHITE_40 } from '../../../theme/Colors';
import { SCREEN_HEIGHT, WRAPPER_MARGIN, SCREEN_WIDTH } from '../../../theme/Layout';
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
    deliveryFormatFilters,
    genderFilters,
    languageFilters,
    projectDurationFilters,
    projectFilters,
    projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { CURRENT_PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { markReviewPromptEligibleForTrigger } from '../../../hooks/useAppReview';

const getValidExternalUrl = url => {
    if (!url || typeof url !== 'string') return '';

    const sanitizedUrl = url
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, '')
        .trim();

    if (!sanitizedUrl) return '';

    const urlWithProtocol = /^https?:\/\//i.test(sanitizedUrl) ? sanitizedUrl : `https://${sanitizedUrl}`;

    if (!/^https?:\/\/[^\s]+$/i.test(urlWithProtocol)) return '';

    return encodeURI(urlWithProtocol);
};

const ProjectDetailsScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const projectId = route?.params?.projectId;

    const { testers } = useFeatureFlags();

    const { allProjects: projects, enrollToProject } = useProjectsContext();

    const { auth } = useAuthContext();

    const { profile } = auth;
    const isTestUser = testers?.emails?.includes(profile?.email);

    const selectedProject = useMemo(() => {
        if (!projects) return null;

        return projects?.find(({ id }) => id === projectId);
    }, [projectId, projects]);

    const enrolled = useMemo(() => {
        if (!selectedProject) return false;

        return selectedProject?.applications?.map(app => app?.creatorId)?.includes(profile?.id);
    }, [selectedProject, profile]);

    const projectLink = useMemo(() => getValidExternalUrl(selectedProject?.link), [selectedProject?.link]);
    const shouldShowViewMore = !!projectLink;

    const handleOpenProjectLink = useCallback(async () => {
        if (!shouldShowViewMore) return;

        try {
            await Linking.openURL(projectLink);
        } catch (error) {
            Alert.alert(t('common.alerts.linkNotAvailable'));
        }
    }, [projectLink, shouldShowViewMore]);

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
            headerRight: () =>
                shouldShowViewMore ? (
                    <HeaderIconButton
                        name="open-outline"
                        title={t('common.actions.viewMore')}
                        onPress={handleOpenProjectLink}
                        backDropColor={WHITE_40}
                        mr={WRAPPER_MARGIN}
                    />
                ) : null,
        });
    }, [navigation, handleOpenProjectLink, shouldShowViewMore, t]);

    useEffect(() => {
        if (selectedProject?.id) {
            markReviewPromptEligibleForTrigger('creator_project_viewed');
        }
    }, [selectedProject?.id]);

    const onEnroll = async () => {
        if (enrolled) {
            navigation.navigate(CURRENT_PROJECT_DETAILS, {
                projectId,
                fromProjectDetails: true,
            });
            return;
        }
        const didEnroll = await enrollToProject(profile?.id, selectedProject);

        if (!didEnroll) {
            return;
        }

        markReviewPromptEligibleForTrigger('creator_project_enrolled');

        Alert.alert(
            t('explore.projectDetails.alerts.enrollSuccess.title'),
            t('explore.projectDetails.alerts.enrollSuccess.message'),
            [
                {
                    text: t('explore.projectDetails.alerts.enrollSuccess.ok'),
                    onPress: () => navigation.goBack(),
                },
            ],
            { cancelable: false },
        );
    };

    const buttonCta = useMemo(() => {
        if (enrolled) return t('explore.projectDetails.buttons.viewStatus');
        return t('explore.projectDetails.buttons.enrollNow');
    }, [enrolled, t]);

    const formatDate = date =>
        new Date(date?.seconds * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    if (!selectedProject) return <LoadingOverlay message={t('explore.projectDetails.loadingMessage')} />;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={styles.contentContainer}
            bounces
        >
            <TemplateBox fullGradient height={SCREEN_HEIGHT / 2.4} gradientColors={DEFAULT_GRADIENT}>
                {/* @ts-ignore */}
                <BackgroundImage source={{ uri: selectedProject?.image }} width={SCREEN_WIDTH} style={styles.image} />
                <TemplateBox absolute top={SCREEN_HEIGHT / 3.4} left={20} pr={20}>
                    <TemplateText bold size={18} color={WHITE}>
                        {selectedProject?.title}
                    </TemplateText>
                    <TemplateBox height={10} />
                    {!!selectedProject?.shortDescription && (
                        <TemplateText size={14} color={WHITE} numberOfLines={2}>
                            {selectedProject?.shortDescription}
                        </TemplateText>
                    )}
                </TemplateBox>
                {!!enrolled && (
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
                        <TemplateText bold size={12} color={WHITE}>
                            {t('explore.projectDetails.enrolledBadge')}
                        </TemplateText>
                    </TemplateBox>
                )}
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN}>
                {!!selectedProject?.description && (
                    <>
                        <TemplateText style={styles.title} bold size={18} color={BLACK}>
                            {t('explore.projectDetails.sections.description')}
                        </TemplateText>
                        <TemplateText color={BLACK} size={14} lineHeight={20}>
                            {selectedProject?.description}
                        </TemplateText>
                    </>
                )}
                {!!selectedProject?.startDate && !!selectedProject?.endDate && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.timeline')}
                        </TemplateText>
                        <TemplateBox>
                            <TemplateText size={14} color={BLACK} numberOfLines={2}>
                                {`${formatDate(selectedProject?.startDate)} - ${formatDate(selectedProject?.endDate)}`}
                            </TemplateText>
                        </TemplateBox>
                    </>
                )}
                <TemplateText style={styles.title} boldr size={20} color={BLACK}>
                    {t('explore.projectDetails.sections.priceRange')}
                </TemplateText>
                <DescriptionRange
                    icon="wallet-outline"
                    maxSubtitle={t('explore.projectDetails.sections.maxBudget')}
                    maxTitle={`${selectedProject?.priceRange?.max || '--'} ${selectedProject?.currency?.symbol || '$'}`}
                    minSubtitle={t('explore.projectDetails.sections.minBudget')}
                    minTitle={`${selectedProject?.priceRange?.min || '--'} ${selectedProject?.currency?.symbol || '$'}`}
                />
                {!!selectedProject?.deliveryFormat && selectedProject?.deliveryFormat?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.deliveryFormat')}
                        </TemplateText>
                        {selectedProject?.deliveryFormat?.map((format, index) => (
                            <DescriptionRow
                                key={index.toString()}
                                title={deliveryFormatFilters?.find(({ value }) => value === format)?.name}
                            />
                        ))}
                    </>
                )}
                {!!selectedProject?.duration && selectedProject?.duration?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.duration')}
                        </TemplateText>
                        {selectedProject?.duration?.map(duration => (
                            <DescriptionRow
                                key={projectDurationFilters?.find(({ value }) => value === duration)?.value}
                                title={projectDurationFilters?.find(({ value }) => value === duration)?.name}
                            />
                        ))}
                    </>
                )}
                {!!selectedProject?.categories && selectedProject?.categories?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.categories')}
                        </TemplateText>
                        {selectedProject?.categories?.map(category => {
                            if (!projectFilters?.find(({ value }) => value === category)?.name) return null;
                            return (
                                <DescriptionRow
                                    key={projectFilters?.find(({ value }) => value === category)?.value}
                                    title={projectFilters?.find(({ value }) => value === category)?.name}
                                />
                            );
                        })}
                    </>
                )}
                {!!selectedProject?.countries && selectedProject?.countries?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.location')}
                        </TemplateText>
                        {selectedProject?.countries?.map(country => (
                            <DescriptionRow
                                key={countryFilters?.find(({ value }) => value === country)?.value}
                                title={countryFilters?.find(({ value }) => value === country)?.name}
                            />
                        ))}
                    </>
                )}
                {!!selectedProject?.gender && selectedProject?.gender?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.genders')}
                        </TemplateText>
                        {selectedProject?.gender?.map(gender => (
                            <DescriptionRow
                                key={genderFilters?.find(({ value }) => value === gender)?.value}
                                title={genderFilters?.find(({ value }) => value === gender)?.name}
                            />
                        ))}
                    </>
                )}
                {!!selectedProject?.languages && selectedProject?.languages?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.languages')}
                        </TemplateText>
                        {selectedProject?.languages?.map(language => (
                            <DescriptionRow
                                key={languageFilters?.find(({ value }) => value === language)?.value}
                                title={languageFilters?.find(({ value }) => value === language)?.name}
                            />
                        ))}
                    </>
                )}
                {!!selectedProject?.ageRange && selectedProject?.ageRange?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.ageRanges')}
                        </TemplateText>
                        {selectedProject?.ageRange?.map(range => (
                            <DescriptionRow
                                key={ageFilters?.find(({ value }) => value === range)?.value}
                                title={ageFilters?.find(({ value }) => value === range)?.name}
                            />
                        ))}
                    </>
                )}
                {!!selectedProject?.projectType && selectedProject?.projectType?.length > 0 && (
                    <>
                        <TemplateText style={styles.title} bold size={20} color={BLACK}>
                            {t('explore.projectDetails.sections.projectType')}
                        </TemplateText>
                        {selectedProject?.projectType?.map(type => (
                            <DescriptionRow
                                key={projectTypeFilters?.find(({ value }) => value === type)?.value}
                                title={projectTypeFilters?.find(({ value }) => value === type)?.name}
                            />
                        ))}
                    </>
                )}
            </TemplateBox>

            <Button
                title={buttonCta}
                style={styles.button}
                color={BLACK_SECONDARY}
                onPress={onEnroll}
                height={50}
                width={SCREEN_WIDTH - 40}
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
