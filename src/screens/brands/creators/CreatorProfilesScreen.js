import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { startCase, toLower } from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getFirestore, collection, query, where, getDocs, limit, startAfter } from '@react-native-firebase/firestore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TemplateText from '../../../components/TemplateText';
import { wp } from '../../../Utils/getResponsiveSize';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    SPACE_MEDIUM,
    SPACE_SMALL,
    SPACE_XSMALL,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    BLACK,
    BRAND_BLUE,
    DEEP_PURPLE,
    IOS_BLUE,
    IOS_GREEN,
    LIGHT_GREEN_25,
    LIGHT_RED_25,
    RED,
    WHITE,
    WHITE_75,
    WHITE_96,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import TemplateIcon from '../../../components/TemplateIcon';
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

import SwipeCard from './SwipeCard';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../consts/content/Portfolio';
import { PROFILE } from '../../../navigation/ScreenNames';
import TemplateSafeAreaView from '../../../components/TemplateSafeAreaView';
import { isIOS } from '../../../Utils/Platform';
import FilterPill from '../../app/explore/components/FilterPill';

import useAuthContext from '../../../hooks/auth/useAuthContext';
import useTranslation from '../../../hooks/useTranslation';

const USERS_COLLECTION = 'users';
const PAGE_SIZE = 20;

const CreatorProfilesScreen = ({ navigation }) => {
    // State
    const [creatorsData, setCreatorsData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

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

        const searchTerm = search ? search.trim() : '';
        if (searchTerm.length > 2) {
            if (searchTerm.includes('.com')) {
                constraints.push(where('email', '==', searchTerm.toLowerCase()));
            } else {
                constraints.push(where('userName', '==', startCase(toLower(searchTerm))));
            }
        }

        if (selectedFilters && selectedFilters.length > 0) {
            const filterArray = selectedFilters.map(f => f.toLowerCase());
            if (filterArray.length > 0) {
                constraints.push(where('categories', 'array-contains-any', filterArray));
            }
        }

        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        constraints.push(limit(PAGE_SIZE));

        return query(collection(db, USERS_COLLECTION), ...constraints);
    };

    /**
     * Main Fetch Function
     */
    const fetchCreators = async (isLoadMore = false) => {
        if (isLoadMore && (loadingMore || !hasMore)) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
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

            const lastDoc = docs[docs.length - 1];

            const newData = docs
                .map(doc => {
                    const rawLastLoginTime = doc.data().lastLoginTime;
                    return {
                        id: doc.id,
                        ...doc.data(),
                        lastLoginTimeRaw: rawLastLoginTime,
                    };
                })
                .filter(creator => creator.image && creator.image !== '')
                .sort((a, b) => {
                    const timeA = a.lastLoginTimeRaw?.seconds || 0;
                    const timeB = b.lastLoginTimeRaw?.seconds || 0;
                    return timeB - timeA;
                });

            if (isLoadMore) {
                setCreatorsData(prev => {
                    const existingIds = new Set(prev.map(c => c.id));
                    const uniqueNew = newData.filter(c => !existingIds.has(c.id));
                    const combined = [...prev, ...uniqueNew];
                    return combined.sort((a, b) => {
                        const timeA = a.lastLoginTimeRaw?.seconds || 0;
                        const timeB = b.lastLoginTimeRaw?.seconds || 0;
                        return timeB - timeA;
                    });
                });
            } else {
                setCreatorsData(newData);
                setCurrentIndex(0);
            }

            setLastVisible(lastDoc);
            setHasMore(docs.length === PAGE_SIZE);
        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setHasMore(true);
            setLastVisible(null);
            fetchCreators(false);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search, selectedFilters]);

    // Load more when nearing end of current batch
    useEffect(() => {
        if (creatorsData.length > 0 && currentIndex >= creatorsData.length - 3 && hasMore && !loadingMore) {
            fetchCreators(true);
        }
    }, [currentIndex, creatorsData.length]);

    const handleSwipeRight = useCallback(
        index => {
            const creator = creatorsData[index];
            if (creator) {
                navigation.navigate(PROFILE, { creatorId: creator.id });
            }
            setCurrentIndex(prev => prev + 1);
        },
        [creatorsData, navigation],
    );

    const handleSwipeLeft = useCallback(() => {
        setCurrentIndex(prev => prev + 1);
    }, []);

    const handleTap = useCallback(
        index => {
            const creator = creatorsData[index];
            if (creator) {
                navigation.navigate(PROFILE, { creatorId: creator.id });
            }
        },
        [creatorsData, navigation],
    );

    const onProjectFilterPress = value => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter(filter => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    const visibleCards = creatorsData.slice(currentIndex, currentIndex + 2);
    const allSwiped = currentIndex >= creatorsData.length && creatorsData.length > 0 && !hasMore;

    return (
        <GestureHandlerRootView style={styles.mainContainer}>
            <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" />

                {/* Header */}
                <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                    <TemplateText size={18} bold startCase>
                        {t(isCreator ? 'creatorExplore.creators.titleCreator' : 'creatorExplore.creators.titleBrand')}
                    </TemplateText>
                </TemplateBox>

                {/* Search bar */}
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

                {/* Active filters */}
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

                {/* Swipe card deck — flex:1 centers the card vertically */}
                <View style={styles.cardDeckOuter}>
                    {loading && !loadingMore ? (
                        <TemplateBox alignItems="center">
                            <ActivityIndicator size="large" color={IOS_BLUE} />
                            <TemplateText mt={SPACE_MEDIUM} color={BLACK}>
                                {t('creatorExplore.creators.loadingMessage')}
                            </TemplateText>
                        </TemplateBox>
                    ) : allSwiped ? (
                        <TemplateBox alignItems="center" ph={WRAPPER_MARGIN}>
                            <TemplateIcon name="people-outline" size={48} color={DEEP_PURPLE} />
                            <TemplateBox height={12} />
                            <TemplateText size={16} semiBold color={BLACK} center>
                                {t('creatorExplore.creators.swipe.allSwiped')}
                            </TemplateText>
                            <TemplateBox height={8} />
                            <TemplateBox
                                onPress={() => {
                                    setCurrentIndex(0);
                                    setHasMore(true);
                                    setLastVisible(null);
                                    fetchCreators(false);
                                }}
                                ph={20}
                                pv={10}
                                borderRadius={10}
                                backgroundColor={DEEP_PURPLE}
                                mt={12}
                            >
                                <TemplateText size={14} color={WHITE} semiBold>
                                    {t('creatorExplore.creators.swipe.startOver')}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    ) : creatorsData.length === 0 && !loading ? (
                        <TemplateBox alignItems="center" justifyContent="center">
                            <TemplateText semiBold>{t('creatorExplore.creators.noResults')}</TemplateText>
                        </TemplateBox>
                    ) : (
                        <View style={styles.cardStack}>
                            {visibleCards
                                .slice()
                                .reverse()
                                .map((creator, reversedIdx) => {
                                    const actualIndex = currentIndex + (visibleCards.length - 1 - reversedIdx);
                                    const isFirst = actualIndex === currentIndex;
                                    return (
                                        <SwipeCard
                                            key={creator.id}
                                            name={creator.userName}
                                            imageUrl={creator.image}
                                            shortDescription={
                                                creator.shortDescription || DEFAULT_CREATOR_SHORT_DESCRIPTION
                                            }
                                            location={creator.location?.country}
                                            categories={creator.categories}
                                            onSwipeRight={() => handleSwipeRight(actualIndex)}
                                            onSwipeLeft={handleSwipeLeft}
                                            isFirst={isFirst}
                                        />
                                    );
                                })}
                        </View>
                    )}

                    {loadingMore && (
                        <TemplateBox mt={8}>
                            <ActivityIndicator size="small" color={IOS_BLUE} />
                        </TemplateBox>
                    )}
                </View>

                {/* Action buttons — outside GestureDetector so they're always pressable */}
                {!loading && !allSwiped && creatorsData.length > 0 && (
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.skipButton]}
                            onPress={handleSwipeLeft}
                            activeOpacity={0.7}
                        >
                            <TemplateIcon name="close" color={RED} size={28} />
                            <TemplateText size={13} semiBold color={RED} mt={2}>
                                {t('creatorExplore.creators.swipe.skip') || 'Skip'}
                            </TemplateText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.viewProfileButton]}
                            onPress={() => handleTap(currentIndex)}
                            activeOpacity={0.7}
                        >
                            <TemplateIcon name="person" color={IOS_GREEN} size={28} />
                            <TemplateText size={13} semiBold color={IOS_GREEN} mt={2}>
                                {t('creatorExplore.creators.swipe.viewProfile') || 'View Profile'}
                            </TemplateText>
                        </TouchableOpacity>
                    </View>
                )}

                <TemplateSafeAreaView ios />

                {/* Filter bottom sheet — unchanged */}
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
                                    translationPrefix="filterCategories"
                                />
                                <FilterCategory
                                    title={t('creatorExplore.creators.filters.categories.country')}
                                    filters={countryFilters}
                                    onFilterPress={onProjectFilterPress}
                                    selectedFilters={selectedFilters}
                                    translationPrefix="filterCountries"
                                />
                                <FilterCategory
                                    title={t('creatorExplore.creators.filters.categories.language')}
                                    filters={languageFilters}
                                    onFilterPress={onProjectFilterPress}
                                    selectedFilters={selectedFilters}
                                    translationPrefix="filterLanguages"
                                />
                                <FilterCategory
                                    title={t('creatorExplore.creators.filters.categories.gender')}
                                    filters={genderFilters}
                                    onFilterPress={onProjectFilterPress}
                                    selectedFilters={selectedFilters}
                                    translationPrefix="filterGenders"
                                />
                                <FilterCategory
                                    title={t('creatorExplore.creators.filters.categories.projectType')}
                                    filters={projectTypeFilters}
                                    onFilterPress={onProjectFilterPress}
                                    selectedFilters={selectedFilters}
                                    translationPrefix="filterProjectTypes"
                                />
                                <FilterCategory
                                    title={t('creatorExplore.creators.filters.categories.deliveryFormat')}
                                    filters={deliveryFormatFilters}
                                    onFilterPress={onProjectFilterPress}
                                    selectedFilters={selectedFilters}
                                    translationPrefix="filterDeliveryFormats"
                                />
                                <FilterCategory
                                    title={t('creatorExplore.creators.filters.categories.duration')}
                                    filters={projectDurationFilters}
                                    onFilterPress={onProjectFilterPress}
                                    selectedFilters={selectedFilters}
                                    translationPrefix="filterProjectDurations"
                                />
                            </View>
                        }
                    />
                </RBSheet>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    cardDeckOuter: {
        flex: 1,
    },
    cardStack: {
        height: SCREEN_HEIGHT * 0.55,
        width: SCREEN_WIDTH,
        marginTop: WRAPPER_MARGIN * 1.5,
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
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 40,
    },
    actionButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE_75,
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    skipButton: {
        borderWidth: 2,
        borderColor: LIGHT_RED_25,
    },
    viewProfileButton: {
        borderWidth: 2,
        borderColor: LIGHT_GREEN_25,
    },
});
export default CreatorProfilesScreen;
