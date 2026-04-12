import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Fuse from 'fuse.js';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import safeToDate from '../../../Utils/safeToDate';
import useTranslation from '../../../hooks/useTranslation';
import TemplateText from '../../../components/TemplateText';
import { BLACK, BRAND_BLUE, TRANSPARENT, WHITE, WHITE_96 } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { HEADER_MARGIN, IS_ANDROID, SCREEN_HEIGHT, SPACE_XSMALL, WRAPPER_MARGIN } from '../../../theme/Layout';
import { SHADOW } from '../../../theme/Shadow';
import TemplateTouchable from '../../../components/TemplateTouchable';
import BrandsTab from './components/BrandsTab';
import Filter from '../../../../assets/svgs/Filter';
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
import FilterCategory from './components/FilterCategory';
import ToggleCarousel from '../../../components/ToggleCarousel';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useGetBrands from '../../../hooks/creators/useGetBrands';
import AllProjectsTab from './components/AllProjectsTab';
import FeedsTab from './components/FeedsTab';
import { FONT_BASE } from '../../../theme/Typography';

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

const TAB_DATA = [BRANDS_TAB, PROJECTS_TAB, FEEDS_TAB];

const ExploreScreen = ({ route }) => {
    const { t } = useTranslation();
    const initialTab = route?.params?.initialTab || TAB_DATA[0];

    const refRBSheet = useRef();

    const [search, setSearch] = useState(null);

    const [selectedTab, setSelectedTab] = useState(TAB_DATA[0]);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const { allProjects: projects } = useProjectsContext();

    const projectsCarouselData = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        return projects
            ?.sort((a, b) => a?.createdAt - b?.createdAt)
            .map(item => ({
                id: item?.id,
                image: item?.image,
                title: item?.title,
                shortDescription: item?.shortDescription,
                duration: `${
                    (safeToDate(item?.endDate) && safeToDate(item?.startDate)
                        ? differenceInWeeks(safeToDate(item?.endDate), safeToDate(item?.startDate))
                        : 0) || 3
                } weeks`,
                projectType: projectTypeFilters.find(({ value }) => value === item?.projectType?.[0])?.name,
            }))
            ?.slice(0, 4);
    }, [projects]);

    const { brands: brandsData } = useGetBrands();

    const onProjectFilterPress = value => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter(filter => filter !== value));
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
        keys: ['name', 'title', 'shortDescription'],
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
            <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                <TemplateText size={18} bold startCase>
                    {t('explore.title')}
                </TemplateText>
            </TemplateBox>
            <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mv={WRAPPER_MARGIN}>
                <TemplateTextInput
                    placeholder={t('explore.searchPlaceholder')}
                    style={[styles.input, SHADOW('default', WHITE)]}
                    value={search}
                    onChangeText={text => setSearch(text)}
                    autoCapitalize="none"
                />
                <TemplateTouchable onPress={() => refRBSheet.current.open()} style={styles.filterButton}>
                    <Filter />
                </TemplateTouchable>
            </TemplateBox>

            <TemplateBox selfCenter flex>
                <ToggleCarousel data={TAB_DATA} selectedTab={selectedTab} onChange={setSelectedTab} />
            </TemplateBox>
            {selectedTab === BRANDS_TAB && filteredBrands && <BrandsTab data={filteredBrands} />}
            {selectedTab === PROJECTS_TAB && filteredProjects && <AllProjectsTab projects={filteredProjects} />}
            {selectedTab === FEEDS_TAB && filteredProjects && <FeedsTab />}
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
                <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
                    <TemplateBox mb={WRAPPER_MARGIN} mt={SPACE_XSMALL} alignItems="center" justifyContent="center" row>
                        <TemplateText size={18} bold>
                            {t('explore.filters.title')}
                        </TemplateText>

                        {selectedFilters.length > 0 && (
                            <TemplateText
                                size={14}
                                color={BRAND_BLUE}
                                style={styles.applyText}
                                onPress={() => {
                                    refRBSheet.current.close();
                                }}
                            >
                                {t('explore.filters.apply')}
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
                                {t('explore.filters.clear')}
                            </TemplateText>
                        )}
                    </TemplateBox>

                    <FilterCategory
                        title={t('explore.filters.categories.projectCategory')}
                        filters={projectFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterCategories"
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.country')}
                        filters={countryFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterCountries"
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.language')}
                        filters={languageFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterLanguages"
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.gender')}
                        filters={genderFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterGenders"
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.ageGroup')}
                        filters={ageFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.projectType')}
                        filters={projectTypeFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterProjectTypes"
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.deliveryFormat')}
                        filters={deliveryFormatFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterDeliveryFormats"
                    />
                    <FilterCategory
                        title={t('explore.filters.categories.projectDuration')}
                        filters={projectDurationFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                        translationPrefix="filterProjectDurations"
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
        fontSize: FONT_BASE,
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
});
export default ExploreScreen;
