/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { HEADER_MARGIN, IS_ANDROID, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLUE_500,
    DARK_METAL,
    IOS_BLUE_20,
    LIGHT_GREEN_10,
    LIGHT_PURPLE,
    METAL,
    TRANSPARENT,
    WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useBrands from '../../../hooks/brands/useBrands';
import { wp } from '../../../Utils/getResponsiveSize';
import { BRAND_APPLICATIONS, WEBVIEW } from '../../../navigation/ScreenNames';
import ToggleCarousel from '../../../components/ToggleCarousel';
import removeDuplicatesFromAffiliateBrands from '../../../Utils/removeAffliliateCategoryDuplicates';
import DynamicIcon from '../../../components/icons/DynamicIcon';
import TemplateIcon from '../../../components/TemplateIcon';
import WebsitePreview, { preloadWebsitePreviews } from './components /WebsitePreview';
import { getCapitalizedFirstLetter } from '../../../Utils/texts';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import useTranslation from '../../../hooks/useTranslation';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { createBrandApplication, getMyBrandApplications } from '../../../lib/brandApplications';
import BrandDetailModal from '../../../components/modals/BrandDetailModal';
import useMailCompose from '../../../hooks/documents/useMailCompose';

const getLocalizedDescription = (item, language) => {
    const key = `description_${language.replace('-', '_')}`;
    return item?.[key] || item?.description;
};

const buildEmailBody = (brandName, profile, t) => {
    const userName = profile?.userName;
    const intro = userName
        ? t('home.platformBrandsCarousel.emailIntro', { userName })
        : t('home.platformBrandsCarousel.emailIntroDefault');

    const signature = [t('home.platformBrandsCarousel.emailRegards'), userName || ''];

    if (profile?.email) {
        signature.push(profile.email);
    }

    const socialMedia = profile?.socialMedia;
    if (socialMedia?.instagram) {
        signature.push(`Instagram: @${socialMedia.instagram}`);
    }
    if (socialMedia?.tiktok) {
        signature.push(`TikTok: @${socialMedia.tiktok}`);
    }
    if (socialMedia?.youtube) {
        signature.push(`YouTube: ${socialMedia.youtube}`);
    }

    return [
        t('home.platformBrandsCarousel.emailGreeting', { brandName }),
        '',
        intro,
        '',
        t('home.platformBrandsCarousel.emailMediaKit'),
        '',
        t('home.platformBrandsCarousel.emailPitch'),
        '',
        t('home.platformBrandsCarousel.emailClosing'),
        '',
        '',
        ...signature,
        '',
        '---',
        t('home.platformBrandsCarousel.emailAttachReminder'),
    ].join('\n');
};

const PlatformBrandsScreen = ({ navigation }) => {
    const { trackEvent } = useTrackEvent();
    const { sendEmailWithAttachment } = useMailCompose();
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { brands: firestoreBrands } = useBrands({ limit: 300 });
    const { auth } = useAuthContext();
    const profile = auth?.profile;
    const uid = profile?.id;

    const [appliedBrands, setAppliedBrands] = useState({});
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const refreshApplications = useCallback(async () => {
        if (!uid) return;
        try {
            const apps = await getMyBrandApplications(uid);
            const map = {};
            apps.forEach(app => {
                const key = app.link || app.brandName;
                map[key] = true;
            });
            setAppliedBrands(map);
        } catch (e) {
            // silent
        }
    }, [uid]);

    useEffect(() => {
        refreshApplications();
    }, [refreshApplications]);

    const brands = useMemo(() => {
        if (!firestoreBrands?.length) return [];
        return [...firestoreBrands].sort((a, b) => {
            const aHasLink = a?.link?.startsWith('http') ? 0 : 1;
            const bHasLink = b?.link?.startsWith('http') ? 0 : 1;
            return aHasLink - bHasLink;
        });
    }, [firestoreBrands]);

    useEffect(() => {
        trackEvent('screen_viewed', { screen: 'platform_brands' });
    }, []);

    useEffect(() => {
        if (brands?.length) {
            preloadWebsitePreviews(brands.slice(0, 10).map(b => b?.link));
        }
    }, [brands]);

    const allCategory = {
        name: t('home.platformBrandsCarousel.allCategory'),
        value: 'all',
    };

    const prCategory = { name: t('home.platformBrandsCarousel.paidPackageReviews'), value: 'Paid Package Reviews' };

    const translateCategory = cat => t(`home.platformBrandsCarousel.categories.${cat}`, cat);

    const brandCategories = useMemo(() => {
        if (!brands) return [];
        const categories = brands
            ?.filter(({ category }) => category !== 'Paid Package Reviews')
            .map(({ category }) => ({ name: translateCategory(category), value: category }));
        const deduped = removeDuplicatesFromAffiliateBrands(categories);
        return [allCategory, prCategory, ...deduped];
    }, [brands]);

    const [selectedTab, setSelectedTab] = useState(brandCategories?.[0] ?? 'Makeup');

    const brandsData = useMemo(() => {
        if (!brands?.length) return [];
        if (selectedTab?.value === 'all') return brands;
        return brands?.filter(({ category }) => category === selectedTab?.value);
    }, [selectedTab, brands]);

    const handleApply = item => {
        if (!item?.email) return;

        trackEvent('brand_apply_with_media_kit', { brandName: item.name });

        const subject = t('home.platformBrandsCarousel.emailSubject', { brandName: item.name });
        const body = buildEmailBody(item.name, profile, t);
        sendEmailWithAttachment({
            recipients: [item.email],
            subject,
            body,
        });

        // Track the application
        const brandKey = item?.link || item?.name;
        if (uid && brandKey) {
            createBrandApplication({
                ownerId: uid,
                brandName: item.name,
                link: item.link || '',
                status: 'applied',
            })
                .then(() => {
                    setAppliedBrands(prev => ({ ...prev, [brandKey]: true }));
                    Toast.show({
                        type: 'success',
                        text1: t('home.platformBrandsCarousel.applicationTracked'),
                    });
                })
                .catch(() => {
                    setAppliedBrands(prev => ({ ...prev, [brandKey]: true }));
                });
        }
    };

    const renderItem = ({ item }) => {
        const alreadyApplied = appliedBrands[item?.link || item?.name];
        return (
            <TemplateBox
                borderRadius={wp(16)}
                pAll={wp(16)}
                style={styles.card}
                width={WRAPPED_SCREEN_WIDTH}
                borderWidth={1}
                borderColor={BLACK_20}
                selfCenter
                mb={20}
                onPress={() => {
                    trackEvent('brand_card_tapped', { brandName: item?.name });
                    setSelectedBrand(item);
                    setModalVisible(true);
                }}
            >
                {/* Header: avatar + name + category */}
                <TemplateBox row alignItems="center" mb={10} justifyContent="space-between">
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
                                color={DARK_METAL}
                            >
                                {item?.name}
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>

                    <TemplateBox row alignItems="center">
                        {item?.category === 'Paid Package Reviews' && (
                            <TemplateBox
                                pv={4}
                                ph={10}
                                borderRadius={10}
                                backgroundColor="#EDE7F6"
                                alignItems="center"
                                justifyContent="center"
                                mr={6}
                            >
                                <TemplateText size={11} bold color="#6A1B9A">
                                    📦 PR
                                </TemplateText>
                            </TemplateBox>
                        )}
                        <TemplateBox
                            pv={4}
                            ph={16}
                            borderRadius={10}
                            backgroundColor={IOS_BLUE_20}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <TemplateText size={12} medium>
                                {translateCategory(item?.category)}
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                </TemplateBox>

                {/* Website Preview */}
                <TemplateBox mv={10}>
                    <WebsitePreview url={item?.link} category={item?.category} brandName={item?.name} height={140} />
                </TemplateBox>

                {/* Description */}
                <TemplateText size={14} numberOfLines={2} mb={10} color={METAL}>
                    {getLocalizedDescription(item, language)}
                </TemplateText>

                {/* Email row */}
                {item?.email && (
                    <TemplateBox row alignItems="center" mb={10}>
                        <TemplateIcon name="mail-outline" color={DARK_METAL} size={14} />
                        <TemplateText size={12} color={DARK_METAL} ml={6} numberOfLines={1}>
                            {item.email}
                        </TemplateText>
                    </TemplateBox>
                )}

                <TemplateBox height={1} width="98%" backgroundColor={BLACK_10} selfCenter mv={4} />

                {/* Actions */}
                <TemplateBox row alignItems="center" justifyContent="space-between" mt={10}>
                    <TemplateBox
                        pv={10}
                        ph={16}
                        borderRadius={8}
                        backgroundColor={alreadyApplied ? `${BLUE_500}15` : LIGHT_GREEN_10}
                    >
                        <TemplateText size={13} medium color={alreadyApplied ? BLUE_500 : DARK_METAL}>
                            {alreadyApplied
                                ? t('home.platformBrandsCarousel.alreadyApplied')
                                : t('home.platformBrandsCarousel.applyWithMediaKit')}
                        </TemplateText>
                    </TemplateBox>
                    {item?.link ? (
                        <TemplateBox
                            row
                            alignItems="center"
                            pv={10}
                            ph={12}
                            onPress={() => {
                                trackEvent('platform_brand_details_viewed', { brandName: item?.name });
                                navigation.navigate(WEBVIEW, { url: item?.link });
                            }}
                        >
                            <TemplateText size={14} color={BLUE_500} medium>
                                {t('home.platformBrandsCarousel.visitWebsite')}
                            </TemplateText>
                            <DynamicIcon name="ArrowRight" color={BLUE_500} />
                        </TemplateBox>
                    ) : (
                        <TemplateBox
                            row
                            alignItems="center"
                            pv={10}
                            ph={12}
                            onPress={() => {
                                trackEvent('brand_card_tapped', { brandName: item?.name });
                                setSelectedBrand(item);
                                setModalVisible(true);
                            }}
                        >
                            <TemplateText size={14} color={BLUE_500} medium>
                                {t('home.platformBrandsCarousel.viewDetails')}
                            </TemplateText>
                            <DynamicIcon name="ArrowRight" color={BLUE_500} />
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>
        );
    };

    const [limit, setLimit] = useState(6);

    useEffect(() => {
        setLimit(6);
    }, [selectedTab]);

    return (
        <>
            <TemplateBox flex backgroundColor={WHITE}>
                <FlatList
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    ListHeaderComponent={
                        <TemplateBox backgroundColor={WHITE} style={{ alignItems: 'center' }}>
                            <TemplateText size={18} startCase bold center>
                                {t('home.platformBrandsCarousel.title')}
                            </TemplateText>
                            <TemplateBox center ph={WRAPPER_MARGIN} mt={8}>
                                <TemplateText size={13} color={BLACK} center mt={8} ml={WRAPPER_MARGIN}>
                                    {t('home.platformBrandsCarousel.description')}
                                </TemplateText>
                            </TemplateBox>

                            {/* View Applications link */}
                            <TemplateBox
                                row
                                alignItems="center"
                                mt={12}
                                onPress={() => {
                                    trackEvent('view_applications_tapped', { source: 'platform_brands_screen' });
                                    navigation.navigate(BRAND_APPLICATIONS);
                                }}
                            >
                                <TemplateIcon name="cash-outline" color={BLUE_500} size={16} />
                                <TemplateText size={14} color={BLUE_500} medium ml={6}>
                                    {t('home.platformBrandsCarousel.viewApplications')}
                                </TemplateText>
                                <DynamicIcon name="ArrowRight" color={BLUE_500} size={16} />
                            </TemplateBox>

                            <TemplateBox selfCenter flex>
                                <ToggleCarousel
                                    data={brandCategories}
                                    selectedTab={selectedTab}
                                    onChange={tab => {
                                        trackEvent('platform_brand_category_selected', { category: tab?.value || tab });
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
            <BrandDetailModal
                visible={modalVisible}
                brand={selectedBrand}
                onClose={() => setModalVisible(false)}
                onApply={() => {
                    const brand = selectedBrand;
                    setModalVisible(false);
                    setSelectedBrand(null);
                    // Delay to allow modal dismiss animation to complete
                    // before presenting the native mail composer
                    setTimeout(() => handleApply(brand), 500);
                }}
                onVisitWebsite={() => {
                    setModalVisible(false);
                    navigation.navigate(WEBVIEW, { url: selectedBrand?.link });
                }}
                alreadyApplied={!!appliedBrands[selectedBrand?.link || selectedBrand?.name]}
            />
        </>
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

export default PlatformBrandsScreen;
