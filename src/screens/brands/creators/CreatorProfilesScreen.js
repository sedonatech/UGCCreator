import React, {
    useEffect, useMemo, useRef, useState,
} from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Fuse from 'fuse.js';
import { sortBy } from 'lodash';
import TemplateText from '../../../components/TemplateText';

import { hp } from '../../../Utils/getResponsiveSize';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_HEIGHT,
    SPACE_LARGE,
    SPACE_XSMALL,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    BLACK, BRAND_BLUE, WHITE, WHITE_96,
} from '../../../theme/Colors';
import Blob from '../../../../assets/svgs/Blob';
import useGetCreators from '../../../hooks/brands/useGetCreators';

import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import TemplateTouchable from '../../../components/TemplateTouchable';
import Filter from '../../../../assets/svgs/Filter';
import FilterCategory from '../../app/explore/components/FilterCategory';
import {
    ageFilters,
    countryFilters, deliveryFormatFilters,
    genderFilters,
    languageFilters, projectDurationFilters,
    projectFilters, projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';

import CreatorCard from './CreatorCard';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../consts/content/Portfolio';
import { PROFILE } from '../../../navigation/ScreenNames';

const CreatorProfilesScreen = ({ navigation }) => {
    const { creators } = useGetCreators();

    const creatorsData = useMemo(() => {
        if (!creators?.length) return [];

        return creators?.map((creator) => ({
            ...creator,
            isActive: creator?.image !== ''
                && (!!creator?.location?.city || !!creator?.location?.country)
                && (!!creator?.socialMedia?.instagram
                    || !!creator?.socialMedia?.facebook
                    || !!creator?.socialMedia?.twitter),
        }));
    }, [creators]);

    const refRBSheet = useRef();

    const [search, setSearch] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const [searchResults, setSearchResults] = useState([]);

    const onProjectFilterPress = (value) => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            'userName',
            'title',
            'shortDescription',
            'location.country',
            'location.city',
            'email',
        ],
    };

    useEffect(() => {
        if (!!search && creatorsData?.length) {
            const fuse = new Fuse(creatorsData, options);
            const results = fuse.search(search).map(({ item }) => item);
            setSearchResults(results);
        }
    }, [search]);

    const filteredCreators = search?.length ? searchResults : creatorsData;

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <Blob top />
            <Blob right />
            <Blob bottom />
            <Blob center />
            <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                <TemplateText
                    size={18}
                    bold
                    startCase
                >
                    Find the perfect creator
                </TemplateText>
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

            {/* { */}
            {/*     filteredCreators?.length > 0 && sortBy(filteredCreators, 'isActive')?.reverse()?.map((creator) => ( */}
            {/*         <CreatorCard */}
            {/*             key={creator?.id} */}
            {/*             name={creator?.userName} */}
            {/*             imageUrl={creator?.image} */}
            {/*             shortDescription={creator?.shortDescription */}
            {/*               || DEFAULT_CREATOR_SHORT_DESCRIPTION} */}
            {/*             location={creator?.location?.country} */}
            {/*             email={creator?.email} */}
            {/*             onPress={() => navigation.navigate(PROFILE, { creatorId: creator?.id })} */}
            {/*             active={creator?.isActive} */}
            {/*         /> */}
            {/*     )) */}
            {/* } */}
            <FlatList
                data={sortBy(filteredCreators, 'isActive')?.reverse()}
                renderItem={({ item }) => (
                    <CreatorCard
                        key={item?.id}
                        name={item?.userName}
                        imageUrl={item?.image}
                        shortDescription={item?.shortDescription
                            || DEFAULT_CREATOR_SHORT_DESCRIPTION}
                        location={item?.location?.country}
                        email={item?.email}
                        onPress={() => navigation.navigate(PROFILE, { creatorId: item?.id })}
                        active={item?.isActive}
                    />
                )}
                showVerticalScrollIndicator={false}
            />

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
    scroll: {
        flex: 1,
        backgroundColor: WHITE,
    },
    scrollContainer: {
        paddingTop: hp(SPACE_LARGE),
        paddingBottom: hp(SPACE_LARGE),
        flexGrow: 1,
        backgroundColor: WHITE,
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
export default CreatorProfilesScreen;
