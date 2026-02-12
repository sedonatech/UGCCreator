/* eslint-disable react-native/no-color-literals */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, StatusBar, StyleSheet, View } from 'react-native';
import { startCase, toLower } from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getFirestore, collection, query, where, getDocs, limit, startAfter } from '@react-native-firebase/firestore';
import TemplateText from '../../../components/TemplateText';
import { wp } from '../../../Utils/getResponsiveSize';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_HEIGHT,
    SPACE_LARGE,
    SPACE_MEDIUM,
    SPACE_SMALL,
    SPACE_XSMALL,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import { BLACK, BRAND_BLUE, IOS_BLUE, WHITE, WHITE_96 } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import TemplateTouchable from '../../../components/TemplateTouchable';
import Filter from '../../../../assets/svgs/Filter';
import FilterCategory from '../../app/explore/components/FilterCategory';
import {
    countryFilters,
    deliveryFormatFilters,
    genderFilters,
    languageFilters,
    projectDurationFilters,
    projectFilters,
    projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';

import CreatorCard from './CreatorCard';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../consts/content/Portfolio';
import { PROFILE } from '../../../navigation/ScreenNames';
import TemplateSafeAreaView from '../../../components/TemplateSafeAreaView';
import { isIOS } from '../../../Utils/Platform';
import FilterPill from '../../app/explore/components/FilterPill';
import calculateLastLoginTime from '../../../Utils/calculateLastLoginTime';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useTranslation from '../../../hooks/useTranslation';

const USERS_COLLECTION = 'users';
const PAGE_SIZE = 20;

const CreatorProfilesScreen = ({ navigation }) => {
    // State
    const [creatorsData, setCreatorsData] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false); // Initial load
    const [loadingMore, setLoadingMore] = useState(false); // Pagination load
    const [hasMore, setHasMore] = useState(true); // Are there more docs?

    // Search & Filter State
    const [search, setSearch] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const db = getFirestore();
    const refRBSheet = useRef();
    const { auth } = useAuthContext();
    const { t } = useTranslation();
    const isCreator = auth?.profile?.type === 'creator';

    /**
     * Build the Firestore Query dynamically based on state
     */
    const buildQuery = (lastDoc = null) => {
        const constraints = [where('type', '==', 'creator')];

        // 1. Search Logic
        const searchTerm = search ? search.trim() : '';
        if (searchTerm.length > 2) {
            if (searchTerm.includes('.com')) {
                constraints.push(where('email', '==', searchTerm.toLowerCase()));
            } else {
                constraints.push(where('userName', '==', startCase(toLower(searchTerm))));
            }
        }

        // 2. Filter Logic (Fixes "invalid value" error)
        if (selectedFilters && selectedFilters.length > 0) {
            const filterArray = selectedFilters.map(f => f.toLowerCase());
            // Firestore throws error if array is empty, strict check required
            if (filterArray.length > 0) {
                constraints.push(where('categories', 'array-contains-any', filterArray));
            }
        }

        // 3. Pagination Logic
        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        // 4. Limit must come last
        constraints.push(limit(PAGE_SIZE));

        // Note: Sorting is handled in JavaScript after fetching to avoid index requirements
        return query(collection(db, USERS_COLLECTION), ...constraints);
    };

    /**
     * Main Fetch Function
     * Handles both initial load and "load more"
     */
    const fetchCreators = async (isLoadMore = false) => {
        // Prevent unnecessary fetching
        if (isLoadMore && (loadingMore || !hasMore)) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            // Determine which "lastDoc" to use. If resetting, use null.
            const cursor = isLoadMore ? lastVisible : null;
            const q = buildQuery(cursor);

            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs;

            if (docs.length === 0) {
                setHasMore(false);
                if (!isLoadMore) setCreatorsData([]);
                setLoading(false);
                setLoadingMore(false);
                return;
            }

            // Capture the last document for the NEXT cursor
            const lastDoc = docs[docs.length - 1];

            // Process data
            const newData = docs
                .map(doc => {
                    const rawLastLoginTime = doc.data().lastLoginTime;
                    return {
                        id: doc.id,
                        ...doc.data(),
                        lastLoginTimeRaw: rawLastLoginTime, // Keep raw timestamp for sorting
                        lastLoginTime: rawLastLoginTime ? calculateLastLoginTime(rawLastLoginTime) : 'days ago',
                    };
                })
                // Requirement: Creators without images need to be filtered out
                .filter(creator => creator.image && creator.image !== '')
                // Sort by last login time (most recent first)
                .sort((a, b) => {
                    const timeA = a.lastLoginTimeRaw?.seconds || 0;
                    const timeB = b.lastLoginTimeRaw?.seconds || 0;
                    return timeB - timeA; // Descending order (most recent first)
                });

            // Update State
            if (isLoadMore) {
                // Append new data, filter duplicates just in case, and sort the combined list
                setCreatorsData(prev => {
                    const existingIds = new Set(prev.map(c => c.id));
                    const uniqueNew = newData.filter(c => !existingIds.has(c.id));
                    const combined = [...prev, ...uniqueNew];
                    // Re-sort combined list to maintain order
                    return combined.sort((a, b) => {
                        const timeA = a.lastLoginTimeRaw?.seconds || 0;
                        const timeB = b.lastLoginTimeRaw?.seconds || 0;
                        return timeB - timeA;
                    });
                });
            } else {
                setCreatorsData(newData);
            }

            setLastVisible(lastDoc);
            // If we got fewer than PAGE_SIZE, we've reached the end
            setHasMore(docs.length === PAGE_SIZE);
        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Debounce/Throttle Search & Filter changes
    // This resets the list and starts from scratch
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setHasMore(true);
            setLastVisible(null);
            fetchCreators(false); // false = Reset (not load more)
        }, 500); // 500ms delay to stop rapid-fire queries

        return () => clearTimeout(delayDebounce);
    }, [search, selectedFilters]);

    const renderItem = useCallback(
        ({ item }) => (
            <CreatorCard
                key={item?.id}
                name={item?.userName}
                imageUrl={item?.image}
                shortDescription={item?.shortDescription || DEFAULT_CREATOR_SHORT_DESCRIPTION}
                location={item?.location?.country}
                email={item?.email}
                lastLoginTime={item?.lastLoginTime}
                onPress={() => navigation.navigate(PROFILE, { creatorId: item?.id })}
                height={wp(194)}
                mt={SPACE_MEDIUM}
            />
        ),
        [navigation],
    );

    const onProjectFilterPress = value => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter(filter => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    return (
        <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={creatorsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showVerticalScrollIndicator={false}
                // Pagination Props
                onEndReached={() => fetchCreators(true)}
                onEndReachedThreshold={0.5}
                // Performance Props (Critical for avoiding crash)
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListHeaderComponent={
                    <>
                        <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                            <TemplateText size={18} bold startCase>
                                {t(
                                    isCreator
                                        ? 'creatorExplore.creators.titleCreator'
                                        : 'creatorExplore.creators.titleBrand',
                                )}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN}>
                            <TemplateTextInput
                                placeholder={t('creatorExplore.creators.searchPlaceholder')}
                                style={[styles.input, SHADOW('default', WHITE)]}
                                value={search}
                                onChangeText={text => setSearch(text)}
                                autoCapitalize="none"
                            />
                            <TemplateTouchable onPress={() => refRBSheet?.current?.open()} style={styles.filterButton}>
                                <Filter />
                            </TemplateTouchable>
                        </TemplateBox>
                        {!!selectedFilters?.length && (
                            <TemplateBox row flexWrap="wrap" pAll={SPACE_SMALL}>
                                {selectedFilters?.map(filter => (
                                    <FilterPill
                                        key={filter}
                                        title={filter}
                                        onPress={() => {
                                            setSelectedFilters(selectedFilters.filter(f => f !== filter));
                                        }}
                                        selected
                                    />
                                ))}
                            </TemplateBox>
                        )}
                    </>
                }
                ListFooterComponent={
                    <View style={styles.listFooter}>
                        {loadingMore && <ActivityIndicator size="small" color={IOS_BLUE} />}
                        <TemplateSafeAreaView ios />
                    </View>
                }
                ListEmptyComponent={
                    !loading && (
                        <TemplateBox flex={1} alignItems="center" justifyContent="center" mt={SPACE_LARGE}>
                            <TemplateText semiBold>{t('creatorExplore.creators.noResults')}</TemplateText>
                        </TemplateBox>
                    )
                }
            />

            {/* Initial Loading State Overlay */}
            {loading && !loadingMore && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={IOS_BLUE} />
                    <TemplateText mt={SPACE_MEDIUM} color={BLACK}>
                        {t('creatorExplore.creators.loadingMessage')}
                    </TemplateText>
                </View>
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
                        height: wp(SCREEN_HEIGHT * 0.84),
                    },
                    draggableIcon: {
                        backgroundColor: BLACK,
                    },
                }}
            >
                <FlatList
                    data={[]}
                    ListHeaderComponent={
                        <View>
                            <TemplateBox
                                mb={WRAPPER_MARGIN}
                                mt={SPACE_XSMALL}
                                alignItems="center"
                                justifyContent="center"
                                row
                            >
                                <TemplateText size={18} bold>
                                    {t('creatorExplore.creators.filters.title')}
                                </TemplateText>

                                {selectedFilters?.length > 0 && (
                                    <TemplateText
                                        size={14}
                                        color={BRAND_BLUE}
                                        style={styles.applyText}
                                        onPress={() => refRBSheet?.current?.close()}
                                    >
                                        {t('creatorExplore.creators.filters.apply')}
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
                                        {t('creatorExplore.creators.filters.clear')}
                                    </TemplateText>
                                )}
                            </TemplateBox>

                            {!!selectedFilters?.length && (
                                <TemplateBox row flexWrap="wrap" pAll={SPACE_SMALL}>
                                    {selectedFilters?.map(filter => (
                                        <FilterPill
                                            key={filter}
                                            title={filter}
                                            onPress={() => {
                                                setSelectedFilters(selectedFilters.filter(f => f !== filter));
                                            }}
                                            selected
                                        />
                                    ))}
                                </TemplateBox>
                            )}

                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.projectCategory')}
                                filters={projectFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.country')}
                                filters={countryFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.language')}
                                filters={languageFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.gender')}
                                filters={genderFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.projectType')}
                                filters={projectTypeFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.deliveryFormat')}
                                filters={deliveryFormatFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                            <FilterCategory
                                title={t('creatorExplore.creators.filters.categories.duration')}
                                filters={projectDurationFilters}
                                onFilterPress={onProjectFilterPress}
                                selectedFilters={selectedFilters}
                            />
                        </View>
                    }
                />
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
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});
export default CreatorProfilesScreen;
