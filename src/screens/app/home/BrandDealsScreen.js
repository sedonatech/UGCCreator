import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import {
    HEADER_MARGIN, IS_ANDROID, WRAPPED_SCREEN_WIDTH,
} from '../../../theme/Layout';
import { BLUE_500, DARK_METAL, LIGHT_GREEN_10, LIGHT_PURPLE, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../Utils/getResponsiveSize';
import { BRAND_APPLICATIONS, WEBVIEW } from '../../../navigation/ScreenNames';
import ToggleCarousel from '../../../components/ToggleCarousel';
import removeDuplicatesFromAffiliateBrands from '../../../Utils/removeAffliliateCategoryDuplicates';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { createBrandApplication } from '../../../lib/brandApplications';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const BrandDealsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();
    const { ugcGigs } = useFeatureFlags();
    const { trackEvent } = useTrackEvent();

    const gigs = ugcGigs?.gigs;

    useEffect(() => {
        trackEvent('screen_viewed', { screen: 'brand_deals' });
    }, []);

    const handleTrackApplication = async (item) => {
        const uid = auth?.profile?.id;
        if (!uid) {
            Alert.alert('Error', 'Please log in to track applications.');
            return;
        }
        try {
            await createBrandApplication({
                ownerId: uid,
                brandName: item?.company || item?.title,
                brandEmail: item?.email,
                link: item?.link,
                status: 'applied',
            });
            trackEvent('application_tracked', { brandName: item?.company || item?.title, link: item?.link });
            Alert.alert('Tracked!', `"${item?.company || item?.title}" added to your application tracker.`);
        } catch (e) {
            console.log('Error tracking application:', e);
            Alert.alert('Error', `Failed to track application: ${e?.message || e}`);
        }
    };

    const allCategory = {
        name: 'All',
        value: 'all',
    };

    const gigsCategories = useMemo(() => {
        if (!gigs) {
            return [];
        }
        const categories = gigs?.map(({ source }) => ({
            name: source,
            value: source,
        }));

        // add all category
        categories.unshift(allCategory);
        return removeDuplicatesFromAffiliateBrands(categories);
    }, [gigs]);

    const [selectedTab, setSelectedTab] = useState(gigsCategories?.[0] ?? 'beauty');

    const gigsFiltered = useMemo(() => {
        if (!gigs?.length) return [];
        if (selectedTab?.value === 'all') return gigs;

        return gigs?.filter(({ source }) => source === selectedTab?.value);
    }, [selectedTab, gigs]);

    const renderItem = ({ item }) => (
        <TemplateBox
            borderRadius={wp(16)}
            backgroundColor={LIGHT_PURPLE}
            pAll={wp(16)}
            style={styles.card}
            width={WRAPPED_SCREEN_WIDTH}
            mb={wp(16)}
            selfCenter
        >
            <TemplateText
                startCase
                size={wp(16)}
                semiBold
            >
                {item?.title}
            </TemplateText>
            <TemplateBox height={wp(8)} />
            <TemplateText
                size={wp(12)}
            >
                {item?.company}
                -
                {item?.source}
            </TemplateText>
            <TemplateBox height={wp(4)} />
            <TemplateText
                size={wp(8)}
            >
                Dive into descriptions, insights with just a tap.
            </TemplateText>
            <TemplateBox height={wp(8)} />
            <TemplateBox row alignItems="center" justifyContent="space-between">
                <TemplateBox
                    pv={6}
                    ph={12}
                    borderRadius={8}
                    backgroundColor={LIGHT_GREEN_10}
                    onPress={() => handleTrackApplication(item)}
                >
                    <TemplateText size={12} medium color={DARK_METAL}>
                        Track Application
                    </TemplateText>
                </TemplateBox>
                <TemplateBox onPress={() => { trackEvent('brand_deal_details_viewed', { brandName: item?.company || item?.title }); navigation.navigate(WEBVIEW, { url: item?.link }); }}>
                    <TemplateText size={12} color={BLUE_500} medium>
                        View Details
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );

    const [limit, setLimit] = useState(6);

    useEffect(() => {
        setLimit(6);
    }, [selectedTab]);

    return (
        <TemplateBox flex backgroundColor={WHITE}>
            <FlatList
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                ListHeaderComponent={(
                    <TemplateBox backgroundColor={WHITE}>
                        <TemplateText
                            size={18}
                            startCase
                            bold
                            center
                            alignSelf="center"
                        >
                            {ugcGigs?.subtitle || 'High-intent teams investing in creator content right now'}
                        </TemplateText>
                        <TemplateBox
                            pv={8}
                            ph={16}
                            borderRadius={10}
                            backgroundColor={BLUE_500}
                            mt={12}
                            onPress={() => { trackEvent('application_tracker_opened'); navigation.navigate(BRAND_APPLICATIONS); }}
                        >
                            <TemplateText size={13} medium color={WHITE}>
                                View Application Tracker
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox selfCenter flex>
                            <ToggleCarousel
                                data={gigsCategories}
                                selectedTab={selectedTab}
                                onChange={(tab) => { trackEvent('brand_deal_category_selected', { category: tab?.name || tab?.value }); setSelectedTab(tab); }}
                            />
                        </TemplateBox>
                        <TemplateBox />
                    </TemplateBox>

                )}
                stickyHeaderIndices={[0]}
                data={gigsFiltered?.slice(0, limit)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item?.name}-${index}`}
                initialNumToRender={6}
                onEndReachedThreshold={0}
                onEndReached={() => { setLimit((prevLimit) => prevLimit + 4); }}
            />
        </TemplateBox>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        marginTop: HEADER_MARGIN,
    },
    contentContainer: {
        flexGrow: 1,
    },
});
export default BrandDealsScreen;
