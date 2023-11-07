import React, {
    useEffect, useMemo, useRef, useState,
} from 'react';
import {
    ActivityIndicator,
    FlatList, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Fuse from 'fuse.js';
import { sortBy } from 'lodash';
import TemplateText from '../../../components/TemplateText';

import { wp } from '../../../Utils/getResponsiveSize';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_HEIGHT,
    SPACE_LARGE, SPACE_MEDIUM,
    SPACE_XSMALL,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    BLACK, BRAND_BLUE, IOS_BLUE, WHITE, WHITE_96,
} from '../../../theme/Colors';
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
import TemplateSafeAreaView from '../../../components/TemplateSafeAreaView';
import { isIOS } from '../../../Utils/Platform';

const CreatorProfilesScreen = ({ navigation }) => {
    const { creators: creatorsData } = useGetCreators();

    const refRBSheet = useRef();

    const [search, setSearch] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const [searchResults, setSearchResults] = useState([]);

    const onProjectFilterPress = (value) => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters?.filter((filter) => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    // TODO: make filtering logic exclusive
    const filteredCreators = useMemo(() => {
        if (!selectedFilters.length) return creatorsData;
        // filter by selected filters
        const filtered = creatorsData?.filter(
            (creator) => selectedFilters.every((filter) => creator?.categories?.includes(filter)),
        );
        if (filtered?.length) return filtered;
    }, [selectedFilters, creatorsData]);

    const options = {
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 1,
        threshold: 0.4,
        useExtendedSearch: true,
        keys: [
            'userName',
        ],
    };

    useEffect(() => {
        if (!!search && filteredCreators?.length) {
            const fuse = new Fuse(filteredCreators, options);
            const results = fuse.search(search).map(({ item }) => item);
            setSearchResults(results);
        }
    }, [search]);

    const filteredSearchedCreators = search?.length ? searchResults : filteredCreators;

    const renderItem = ({ item }) => (
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
    );

    return (
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={styles.mainContainer}
        >
            <StatusBar barStyle="default" />
            <FlatList
                data={sortBy(filteredSearchedCreators, 'isActive')?.reverse()}
                renderItem={renderItem}
                showVerticalScrollIndicator={false}
                keyExtractor={(item, index) => (`${item?.id}-${index}`)}
                ListHeaderComponent={(
                    <>
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
                    </>
                )}
                ListFooterComponent={(
                    <View style={styles.listFooter}>
                        <TemplateSafeAreaView ios />
                    </View>
                )}
                ListEmptyComponent={(
                    <TemplateBox
                        flex={1}
                        alignItems="center"
                        justifyContent="center"
                        mt={SPACE_LARGE}
                        center
                        selfCenter
                    >
                        <ActivityIndicator size="large" color={IOS_BLUE} />
                    </TemplateBox>
                )}
                initialNumToRender={5}
                onEndReachedThreshold={0.5}
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
                        height: SCREEN_HEIGHT * 0.9,
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
    listFooter: {
        paddingBottom: wp(SPACE_MEDIUM),
    },
});
export default CreatorProfilesScreen;
