/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { HEADER_MARGIN, IS_ANDROID, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLUE_500,
    DARK_METAL,
    FUCSHIA_500,
    IOS_BLUE_20,
    LIGHT_GREEN_10,
    LIGHT_PURPLE,
    METAL,
    TRANSPARENT,
    WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../Utils/getResponsiveSize';
import { BRAND_APPLICATIONS, WEBVIEW } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { createBrandApplication } from '../../../lib/brandApplications';
import ToggleCarousel from '../../../components/ToggleCarousel';
import removeDuplicatesFromAffiliateBrands from '../../../Utils/removeAffliliateCategoryDuplicates';
import DynamicIcon from '../../../components/icons/DynamicIcon';
import { getCapitalizedFirstLetter } from '../../../Utils/texts';
import useTranslation from '../../../hooks/useTranslation';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const AffiliateBrandsScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { trackEvent } = useTrackEvent();
    const { auth } = useAuthContext();
    const { affiliate } = useFeatureFlags();
    const title = route?.params?.title;
    const affiliateBrands = affiliate?.brands;

    const handleTrackApplication = async item => {
        const uid = auth?.profile?.id;
        if (!uid) {
            Alert.alert('Error', 'Please log in to track applications.');
            return;
        }
        try {
            trackEvent('application_tracked', { brandName: item?.name, link: item?.link });
            await createBrandApplication({
                ownerId: uid,
                brandName: item?.name,
                brandEmail: item?.email,
                link: item?.link,
                status: 'applied',
            });
            Alert.alert('Tracked!', `"${item?.name}" added to your application tracker.`);
        } catch (e) {
            console.log('Error tracking application:', e);
            Alert.alert('Error', `Failed to track application: ${e?.message || e}`);
        }
    };

    const allCategory = {
        name: 'All',
        value: 'all',
    };

    const brandCategories = useMemo(() => {
        if (!affiliateBrands) {
            return [];
        }
        const categories = affiliateBrands?.map(({ category }) => ({
            name: category,
            value: category,
        }));

        // add all category
        categories.unshift(allCategory);
        return removeDuplicatesFromAffiliateBrands(categories);
    }, [affiliateBrands]);

    const [selectedTab, setSelectedTab] = useState(brandCategories?.[0] ?? 'beauty');

    const brandsData = useMemo(() => {
        if (!affiliateBrands?.length) return [];
        if (selectedTab?.value === 'all') return affiliateBrands;

        return affiliateBrands?.filter(({ category }) => category === selectedTab?.value);
    }, [selectedTab, affiliateBrands]);

    const renderItem = ({ item }) => (
        <TemplateBox
            borderRadius={wp(16)}
            pAll={wp(16)}
            style={styles.card}
            width={WRAPPED_SCREEN_WIDTH}
            borderWidth={1}
            borderColor={BLACK_20}
            selfCenter
            mb={20}
        >
            {/* header row: avatar + name/link on the left, category pill on the right */}
            <TemplateBox row alignItems="center" mb={10} justifyContent="space-between">
                {/* left block takes remaining space */}
                <TemplateBox row alignItems="center" flex={1} mr={10}>
                    <TemplateBox
                        height={50}
                        width={50}
                        mr={10}
                        borderRadius={10}
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={LIGHT_GREEN_10}
                        shadow
                        shadowColor={BLACK}
                    >
                        <TemplateText startCase size={20} bold color={DARK_METAL}>
                            {getCapitalizedFirstLetter(item?.name)}
                        </TemplateText>
                    </TemplateBox>

                    <TemplateBox flex={1}>
                        <TemplateText
                            startCase
                            size={16}
                            semiBold
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            mb={4}
                            color={DARK_METAL}
                        >
                            {item?.name}
                        </TemplateText>
                        <TemplateBox row alignItems="center">
                            <TemplateText
                                size={10}
                                mr={5}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                color={FUCSHIA_500}
                                maxWidth={100}
                            >
                                {item?.link}
                            </TemplateText>
                            <DynamicIcon name="Link" color={FUCSHIA_500} />
                        </TemplateBox>
                    </TemplateBox>
                </TemplateBox>

                {/* right block: fixed category pill */}
                <TemplateBox
                    pv={4}
                    ph={16}
                    borderRadius={10}
                    backgroundColor={IOS_BLUE_20}
                    alignItems="center"
                    justifyContent="center"
                >
                    <TemplateText size={12} medium>
                        {item?.category}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateText size={14} numberOfLines={3} mv={10} color={METAL}>
                {item?.description}
            </TemplateText>

            <TemplateBox height={1} width="98%" backgroundColor={BLACK_10} selfCenter mv={10} />
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
                <TemplateBox
                    row
                    alignItems="center"
                    onPress={() => {
                        trackEvent('affiliate_brand_details_viewed', { brandName: item?.name });
                        navigation.navigate(WEBVIEW, { url: item?.link });
                    }}
                >
                    <TemplateText size={14} color={BLUE_500} medium>
                        {t('home.affiliateBrandsCarousel.viewDetails')}
                    </TemplateText>
                    <DynamicIcon name="ArrowRight" color={BLUE_500} />
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );

    const [limit, setLimit] = useState(6);

    useEffect(() => {
        trackEvent('screen_viewed', { screen: 'affiliate_brands' });
    }, []);

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
                ListHeaderComponent={
                    <TemplateBox backgroundColor={WHITE} style={{ alignItems: 'center' }}>
                        <TemplateText size={18} startCase bold center>
                            {title}
                        </TemplateText>
                        <TemplateBox center ph={WRAPPER_MARGIN} mt={8}>
                            <TemplateText size={13} color={BLACK} center mt={8} ml={WRAPPER_MARGIN}>
                                {t('home.affiliateBrandsCarousel.description')}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox
                            pv={8}
                            ph={16}
                            borderRadius={10}
                            backgroundColor={BLUE_500}
                            mt={12}
                            onPress={() => {
                                trackEvent('application_tracker_opened');
                                navigation.navigate(BRAND_APPLICATIONS);
                            }}
                        >
                            <TemplateText size={13} medium color={WHITE}>
                                View Application Tracker
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox selfCenter flex>
                            <ToggleCarousel
                                data={brandCategories}
                                selectedTab={selectedTab}
                                onChange={tab => {
                                    trackEvent('affiliate_category_selected', { category: tab?.value || tab });
                                    setSelectedTab(tab);
                                }}
                            />
                        </TemplateBox>
                        <TemplateBox />
                    </TemplateBox>
                }
                stickyHeaderIndices={[0]}
                data={brandsData?.slice(0, limit)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item?.name}-${index}`}
                initialNumToRender={6}
                onEndReachedThreshold={0}
                onEndReached={() => {
                    setLimit(prevLimit => prevLimit + 4);
                }}
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
    card: {
        backgroundColor: WHITE,
        borderColor: LIGHT_PURPLE,
        borderWidth: 1.5,
    },
});
export default AffiliateBrandsScreen;
