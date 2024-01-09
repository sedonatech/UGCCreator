import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import Fuse from 'fuse.js';
import { projectTypeFilters } from '../../../consts/AppFilters/ProjectFilters';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import { HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import AllProjectsTab from '../explore/components/AllProjectsTab';

const ProjectsScreen = () => {
    const { allProjects: projects } = useProjectsContext();

    const [search, setSearch] = useState('');

    const [projectsSearchResults, setProjectsSearchResults] = useState([]);

    const projectsCarouselData = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        return projects?.sort((a, b) => (a?.createdAt - b?.createdAt)).map((item) => ({
            id: item?.id,
            image: item?.image,
            title: item?.title,
            shortDescription: item?.shortDescription,
            duration: `${differenceInWeeks(new Date(item?.endDate), new Date(item?.startDate)) || 3} weeks`,
            projectType: projectTypeFilters.find(({ value }) => value === item?.projectType[0])?.name,
        }))?.slice(0, 4);
    }, [projects]);

    const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            'name',
            'title',
            'shortDescription',
        ],
    };

    useEffect(() => {
        if (!!search && projectsCarouselData?.length) {
            const fuse = new Fuse(projectsCarouselData, options);
            const results = fuse.search(search).map(({ item }) => item);
            setProjectsSearchResults(results);
        }
    }, [search, projectsCarouselData]);

    const filteredProjects = useMemo(() => {
        if (!projectsCarouselData) return [];

        return search?.length ? projectsSearchResults : projectsCarouselData;
    }, [search, projectsCarouselData]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
        >
            <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                <TemplateText size={18} bold startCase>Explore Projects</TemplateText>
            </TemplateBox>
            <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mv={WRAPPER_MARGIN}>
                <TemplateTextInput
                    placeholder="Search"
                    style={[styles.input, SHADOW('default', WHITE)]}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    autoCapitalize="none"
                />
            </TemplateBox>
            <AllProjectsTab projects={filteredProjects} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
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
});

export default ProjectsScreen;
