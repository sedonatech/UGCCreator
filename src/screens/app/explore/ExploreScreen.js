import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Fuse from 'fuse.js';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK, BRAND_BLUE, LAVENDER, TRANSPARENT, WHITE, WHITE_90, WHITE_96,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import Blob from '../../../../assets/svgs/Blob';
import TemplateTextInput from '../../../components/TemplateTextInput';
import {
    IS_ANDROID,
    SCREEN_HEIGHT, SPACE_XSMALL, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import { SHADOW } from '../../../theme/Shadow';
import TemplateTouchable from '../../../components/TemplateTouchable';
import ExploreTabSelector from './components/ExploreTabSelector';
import BrandsTab from './BrandsTab';
import ProjectsTab from './ProjectsTab';
import Filter from '../../../../assets/svgs/Filter';
import {
    countryFilters,
    genderFilters,
    languageFilters,
    projectFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import { BRANDS, PROJECTS } from '../../../consts/content/Home';
import FilterCategory from './components/FilterCategory';

export const BRANDS_TAB = 'Brands';
export const PROJECTS_TAB = 'Projects';

const TABS = [BRANDS_TAB, PROJECTS_TAB];

const ExploreScreen = ({ route }) => {
    const initialTab = route?.params?.initialTab || TABS[0];

    const refRBSheet = useRef();

    const [search, setSearch] = useState(null);

    const [selectedTab, setSelectedTab] = useState(TABS[0]);

    const [selectedFilters, setSelectedFilters] = useState([]);

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
        if (!!search && BRANDS?.length) {
            const fuse = new Fuse(BRANDS, options);
            const results = fuse.search(search).map(({ item }) => item);
            setSearchResults(results);
        }

        if (!!search && PROJECTS?.length) {
            const fuse = new Fuse(PROJECTS, options);
            const results = fuse.search(search).map(({ item }) => item);
            setProjectsSearchResults(results);
        }
    }, [search]);

    useEffect(() => {
        if (initialTab === BRANDS_TAB) {
            setSelectedTab(BRANDS_TAB);
        } else if (initialTab === PROJECTS_TAB) {
            setSelectedTab(PROJECTS_TAB);
        }
    }, [initialTab]);

    const filteredBrands = search?.length ? searchResults : BRANDS;

    const filteredProjects = search?.length ? projectsSearchResults : PROJECTS;

    return (
        <ScrollView style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>

            <TemplateBox mt={SCREEN_HEIGHT * 0.15} alignItems="center" justifyContent="center">
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

            <ExploreTabSelector
                tabs={TABS}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />

            {selectedTab === BRANDS_TAB && filteredBrands && (
                <BrandsTab data={filteredBrands} />
            )}
            {selectedTab === PROJECTS_TAB && filteredProjects && (
                <ProjectsTab data={filteredProjects} />
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

                <ScrollView>
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
});
export default ExploreScreen;
