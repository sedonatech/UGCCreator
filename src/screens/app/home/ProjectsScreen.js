import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import Fuse from 'fuse.js';
import safeToDate from '../../../Utils/safeToDate';
import { useNavigation } from '@react-navigation/native';
import useTranslation from '../../../hooks/useTranslation';
import { projectTypeFilters } from '../../../consts/AppFilters/ProjectFilters';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import { HEADER_MARGIN, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import UGCProjectsCard from './components /UGCProjectsCard';
import { PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import { wp } from '../../../Utils/getResponsiveSize';
import { FONT_BASE } from '../../../theme/Typography';

const ProjectsScreen = () => {
    const { t } = useTranslation();
    const { allProjects: projects, setProjectLimits, projectLimits } = useProjectsContext();
    const { auth } = useAuthContext();
    const { profile } = auth;
    const navigation = useNavigation();
    const { trackEvent } = useTrackEvent();

    useEffect(() => {
        trackEvent('screen_viewed', { screen: 'projects' });
    }, []);

    useEffect(() => setProjectLimits(10), []);
    const [search, setSearch] = useState('');
    const [projectsSearchResults, setProjectsSearchResults] = useState([]);

    const projectsCarouselData = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        return projects?.map(item => ({
            id: item?.id,
            image: item?.image,
            title: item?.title,
            isBlocked: item?.isBlocked,
            shortDescription: item?.shortDescription,
            duration: `${
                (safeToDate(item?.endDate) && safeToDate(item?.startDate)
                    ? differenceInWeeks(safeToDate(item?.endDate), safeToDate(item?.startDate))
                    : 0) ||
                3(
                    safeToDate(item?.endDate) && safeToDate(item?.startDate)
                        ? differenceInWeeks(safeToDate(item?.endDate), safeToDate(item?.startDate))
                        : 0,
                ) ||
                3
            } weeks`,
            projectType: projectTypeFilters.find(({ value }) => value === item?.projectType?.[0])?.name,
        }));
    }, [projects]);

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
        if (!!search && projectsCarouselData?.length) {
            const fuse = new Fuse(projectsCarouselData, options);
            const results = fuse.search(search).map(({ item }) => item);
            setProjectsSearchResults(results);
        }
        if (search?.length > 2) {
            trackEvent('project_searched', { query: search });
        }
    }, [search, projectsCarouselData]);

    const filteredProjects = useMemo(() => {
        if (!projectsCarouselData) return [];

        const result = search?.length ? projectsSearchResults : projectsCarouselData;
        return result?.filter(item => !!item?.image);
    }, [search, projectsCarouselData]);

    const renderItem = ({ item }, index) => (
        <UGCProjectsCard
            key={item?.id}
            image={!!item?.image && { uri: item?.image }}
            title={item?.title}
            shortDescription={item?.shortDescription}
            slideInDelay={(index + 1) * 100}
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
            height={190}
            // @ts-ignore
            onPress={() => {
                trackEvent('project_tapped', { projectId: item?.id });
                navigation.navigate(PROJECT_DETAILS, {
                    projectId: item?.id,
                });
            }}
            enrolled={item?.applications?.map(app => app?.creatorId)?.includes(profile?.id)}
            duration={item?.duration}
            projectType={item?.projectType}
            style={styles.card}
            selectedProject={item}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={
                <TemplateBox alignItems="center" justifyContent="center">
                    <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                        <TemplateText size={18} bold startCase>
                            {t('home.projects.title')}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mv={WRAPPER_MARGIN}>
                        <TemplateTextInput
                            placeholder={t('home.projects.searchPlaceholder')}
                            style={[styles.input, SHADOW('default', WHITE)]}
                            value={search}
                            onChangeText={text => setSearch(text)}
                            autoCapitalize="none"
                        />
                    </TemplateBox>
                </TemplateBox>
            }
            data={filteredProjects}
            keyExtractor={item => item?.id}
            renderItem={renderItem}
            extraData={projectLimits}
            initialNumToRender={5}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                setProjectLimits(prevLimit => prevLimit + 10);
            }}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: wp(20),
        marginLeft: WRAPPER_MARGIN,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingRight: 30,
        paddingLeft: 10,
        fontSize: FONT_BASE,
        color: BLACK,
    },
});

export default ProjectsScreen;
