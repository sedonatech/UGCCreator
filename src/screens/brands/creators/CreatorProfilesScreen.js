import React, {
    useCallback,
    useEffect, useRef, useState,
} from 'react';
import {
    ActivityIndicator,
    FlatList, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';
import {
    throttle, startCase,
    toLower,
} from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import TemplateText from '../../../components/TemplateText';
import { wp } from '../../../Utils/getResponsiveSize';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_HEIGHT,
    SPACE_LARGE, SPACE_MEDIUM, SPACE_SMALL,
    SPACE_XSMALL,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    BLACK, BRAND_BLUE, IOS_BLUE, WHITE, WHITE_96,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import TemplateTouchable from '../../../components/TemplateTouchable';
import Filter from '../../../../assets/svgs/Filter';
import FilterCategory from '../../app/explore/components/FilterCategory';
import {
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
import FilterPill from '../../app/explore/components/FilterPill';
import calculateLastLoginTime from '../../../Utils/calculateLastLoginTime';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const USERS_COLLECTION = 'users';

const renderItem = (item, navigation) => (
    <CreatorCard
        key={item?.id}
        name={item?.userName}
        imageUrl={item?.image}
        shortDescription={item?.shortDescription
                        || DEFAULT_CREATOR_SHORT_DESCRIPTION}
        location={item?.location?.country}
        email={item?.email}
        onPress={() => navigation.navigate(PROFILE, { creatorId: item?.id })}
        height={wp(194)}
        mt={SPACE_MEDIUM}
    />
);

const CreatorProfilesScreen = ({ navigation }) => {
    const [creatorsData, setCreatorsData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filteredData, setFilteredCreators] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchActive = search?.length > 2 || selectedFilters?.length;

    const creatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator')
        .limit(limit);

    let filteredCreatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator')
        .limit(limit);

    if (search?.includes('.com')) filteredCreatorsRef = filteredCreatorsRef.where('email', '==', search?.toLowerCase());
    if (search?.length > 2 && !search?.includes('.com')) filteredCreatorsRef = filteredCreatorsRef.where('userName', '==', startCase(toLower(search)));
    if (selectedFilters?.length) {
        const filterArray = selectedFilters.map((filter) => filter.toLowerCase());
        filteredCreatorsRef = filteredCreatorsRef.where('categories', 'array-contains-any', filterArray);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await creatorsRef.limit(limit).get();
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    lastLoginTime: doc.data().lastLoginTime ? calculateLastLoginTime(doc.data().lastLoginTime) : 'days ago',
                }));
                setCreatorsData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData(); // Call the fetch function
    }, [limit]);

    const searchCreator = async () => {
        setLoading(true);
        setFilteredCreators([]);
        const querySnapshot = await filteredCreatorsRef.get();
        const data = querySnapshot?.docs
            ?.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
                lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
            }));
        setLoading(false);
        setFilteredCreators(data);
    };

    const throttledSearchCreator = useCallback(
        throttle(searchCreator, 300), [search, selectedFilters],
    );

    // search creator by email / selected filters
    useEffect(() => {
        if (!searchActive) {
            setFilteredCreators([]);
            setLimit(10);
            return;
        }
        throttledSearchCreator();
    }, [searchActive, search, selectedFilters, throttledSearchCreator]);

    const refRBSheet = useRef();

    const onProjectFilterPress = (value) => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters?.filter((filter) => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    const filteredSearchedCreators = searchActive ? filteredData : creatorsData;

    const isFocused = useIsFocused();

    useEffect(() => {
        setLimit(10);
    }, [isFocused]);

    const { auth } = useAuthContext();
    const isCreator = auth?.profile?.type === 'creator';

    return (
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={styles.mainContainer}
        >
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={filteredSearchedCreators?.sort((a, b) => b?.image?.localeCompare(a?.image))}
                renderItem={({ item }) => renderItem(item, navigation)}
                showVerticalScrollIndicator={false}
                keyExtractor={(item, index) => (`${item?.id}-${index}`)}
                ListHeaderComponent={(
                    <>
                        <TemplateBox
                            mt={HEADER_MARGIN}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <TemplateText
                                size={18}
                                bold
                                startCase
                            >
                                {`${isCreator ? 'Collaborate with' : 'FInd'} the perfect creator`}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN}>
                            <TemplateTextInput
                                placeholder="Search"
                                style={[styles.input, SHADOW('default', WHITE)]}
                                value={search}
                                onChangeText={(text) => setSearch(text)}
                                autoCapitalize="none"
                            />
                            <TemplateTouchable
                                onPress={() => refRBSheet?.current?.open()}
                                style={styles.filterButton}
                            >
                                <Filter />
                            </TemplateTouchable>
                        </TemplateBox>
                        {!!selectedFilters?.length && (
                            <TemplateBox row flexWrap="wrap" pAll={SPACE_SMALL}>
                                {selectedFilters?.map((filter) => (
                                    <FilterPill
                                        key={filter}
                                        title={filter}
                                        onPress={() => {
                                            setSelectedFilters(selectedFilters?.filter((f) => f !== filter));
                                        }}
                                        selected
                                    />
                                ))}
                            </TemplateBox>
                        )}
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
                        {(!creatorsData?.length || loading) && <ActivityIndicator size="large" color={IOS_BLUE} />}
                        {((creatorsData?.length > 0 && !filteredSearchedCreators?.length)
                        && !loading)
                            && <TemplateText semiBold>No results found</TemplateText>}
                    </TemplateBox>
                )}
                initialNumToRender={10}
                onEndReachedThreshold={0.5}
                onEndReached={() => { setLimit((prevLimit) => prevLimit + 10); }}
                removeClippedSubviews
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
                        height: wp(SCREEN_HEIGHT * 0.84),
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

                        {selectedFilters?.length > 0 && (
                            <TemplateText
                                size={14}
                                color={BRAND_BLUE}
                                style={styles.applyText}
                                onPress={() => {
                                    refRBSheet?.current?.close();
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
                                    refRBSheet?.current?.close();
                                }}
                            >
                                Clear Filters
                            </TemplateText>
                        )}
                    </TemplateBox>

                    {!!selectedFilters?.length && (
                        <TemplateBox row flexWrap="wrap" pAll={SPACE_SMALL}>
                            {selectedFilters?.map((filter) => (
                                <FilterPill
                                    key={filter}
                                    title={filter}
                                    onPress={() => {
                                        setSelectedFilters(selectedFilters?.filter((f) => f !== filter));
                                    }}
                                    selected
                                />
                            ))}
                        </TemplateBox>
                    )}

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
        height: wp(50),
        borderRadius: wp(10),
        paddingHorizontal: wp(12),
        fontSize: wp(16),
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
