import React, {
    useEffect, useMemo, useRef, useState,
} from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Fuse from 'fuse.js';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK, BRAND_BLUE, TRANSPARENT, WHITE, WHITE_96,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_HEIGHT, SPACE_XSMALL, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import { SHADOW } from '../../../theme/Shadow';
import TemplateTouchable from '../../../components/TemplateTouchable';
import BrandsTab from './components/BrandsTab';
import Filter from '../../../../assets/svgs/Filter';
import {
    ageFilters,
    countryFilters, deliveryFormatFilters,
    genderFilters,
    languageFilters, projectDurationFilters,
    projectFilters, projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from './components/FilterCategory';
import ToggleCarousel from '../../../components/ToggleCarousel';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useGetBrands from '../../../hooks/creators/useGetBrands';
import AllProjectsTab from './components/AllProjectsTab';
import FeedsTab from './components/FeedsTab';
import RecommendedBrandsCarousel from '../home/components /RecommendedBrandsCarousel';

export const BRANDS_TAB = {
    name: 'Brands',
    value: 'brands',
};
export const PROJECTS_TAB = {
    name: 'Projects',
    value: 'projects',
};

export const FEEDS_TAB = {
    name: 'Feeds',
    value: 'feeds',
};

export const RECOMMENDED_TAB = {
    name: 'Recommended',
    value: 'recommended',
};

const TAB_DATA = [BRANDS_TAB, RECOMMENDED_TAB, PROJECTS_TAB, FEEDS_TAB];

const ExploreScreen = ({ route }) => {
    const initialTab = route?.params?.initialTab || TAB_DATA[0];

    const refRBSheet = useRef();

    const [search, setSearch] = useState(null);

    const [selectedTab, setSelectedTab] = useState(TAB_DATA[0]);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const { allProjects: projects } = useProjectsContext();

    const projectsCarouselData = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        return projects?.sort((a,b) => (a?.createdAt - b?.createdAt)).map((item) => ({
            id: item?.id,
            image: item?.image,
            title: item?.title,
            shortDescription: item?.shortDescription,
            duration: `${differenceInWeeks(new Date(item?.endDate), new Date(item?.startDate)) || 3} weeks`,
            projectType: projectTypeFilters.find(({ value }) => value === item?.projectType[0])?.name,
        }))?.slice(0, 4);
    }, [projects]);

    const { brands: brandsData } = useGetBrands();

    const onProjectFilterPress = (value) => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    const [searchResults, setSearchResults] = useState([]);

    const [projectsSearchResults, setProjectsSearchResults] = useState([]);

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
        if (!!search && brandsData?.length) {
            const fuse = new Fuse(brandsData, options);
            const results = fuse.search(search).map(({ item }) => item);
            setSearchResults(results);
        }

        if (!!search && projectsCarouselData?.length) {
            const fuse = new Fuse(projectsCarouselData, options);
            const results = fuse.search(search).map(({ item }) => item);
            setProjectsSearchResults(results);
        }
    }, [search, projectsCarouselData, brandsData]);

    useEffect(() => {
        if (initialTab === BRANDS_TAB) {
            setSelectedTab(BRANDS_TAB);
        } else if (initialTab === PROJECTS_TAB) {
            setSelectedTab(PROJECTS_TAB);
        }
    }, [initialTab]);

    const filteredBrands = useMemo(() => {
        if (!brandsData) return [];

        return search?.length ? searchResults : brandsData;
    }, [search, brandsData]);

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
                <TemplateText size={18} bold startCase>Explore Brands and Projects</TemplateText>
            </TemplateBox>
            <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mv={WRAPPER_MARGIN}>
                <TemplateTextInput
                    placeholder="Search"
                    style={[styles.input, SHADOW('default', WHITE)]}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    autoCapitalize="none"
                />
                <TemplateTouchable
                    onPress={() => refRBSheet.current.open()}
                    style={styles.filterButton}
                >
                    <Filter />
                </TemplateTouchable>
            </TemplateBox>

            <TemplateBox selfCenter flex>
                <ToggleCarousel
                    data={TAB_DATA}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                />
            </TemplateBox>
            {selectedTab === BRANDS_TAB && filteredBrands && (
                <BrandsTab data={filteredBrands} />
            )}
            {selectedTab === PROJECTS_TAB && filteredProjects && (
                <AllProjectsTab projects={filteredProjects} />
            )}
            {selectedTab === FEEDS_TAB && filteredProjects && (
                <FeedsTab />
            )}
            {selectedTab === RECOMMENDED_TAB && (
                <RecommendedBrandsCarousel style={styles.carousel} />
            )}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                closeOnPressMask
                customStyles={{
                    wrapper: {

                        blurType: 'dark',
                        blurAmount: 10,
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: IS_ANDROID ? WHITE_96 : WHITE,
                        paddingTop: 10,
                        paddingBottom: 40,
                        height: SCREEN_HEIGHT * 0.7,
                    },
                    draggableIcon: {
                        backgroundColor: BLACK,
                    },
                }}
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <TemplateBox
                        mb={WRAPPER_MARGIN}
                        mt={SPACE_XSMALL}
                        alignItems="center"
                        justifyContent="center"
                        row
                    >
                        <TemplateText size={18} bold>Select Filters</TemplateText>

                        {selectedFilters.length > 0 && (
                            <TemplateText
                                size={14}
                                color={BRAND_BLUE}
                                style={styles.applyText}
                                onPress={() => {
                                    refRBSheet.current.close();
                                }}
                            >
                                Apply Filters
                            </TemplateText>
                        )}

                        {selectedFilters.length > 0 && (
                            <TemplateText
                                size={14}
                                color={BRAND_BLUE}
                                style={styles.applyText}
                                onPress={() => {
                                    setSelectedFilters([]);
                                    refRBSheet.current.close();
                                }}
                            >
                                Clear Filters
                            </TemplateText>
                        )}
                    </TemplateBox>

                    <FilterCategory
                        title="Project Category"
                        filters={projectFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}

                    />
                    <FilterCategory
                        title="Country"
                        filters={countryFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Language"
                        filters={languageFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Gender"
                        filters={genderFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Age Group"
                        filters={ageFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Project Type"
                        filters={projectTypeFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Delivery Format"
                        filters={deliveryFormatFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Project Duration"
                        filters={projectDurationFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />

                </ScrollView>

            </RBSheet>

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
    filterButton: {
        position: 'absolute',
        right: 10,
        bottom: 13,
        zIndex: 1,
    },
    applyText: {
        marginLeft: WRAPPER_MARGIN,
    },
    carousel: {
        marginVertical: WRAPPER_MARGIN,
    },
});
export default ExploreScreen;
