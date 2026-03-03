/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
    AMBER_50,
    AMBER_600,
    BLACK,
    BLACK_10,
    EMERALD_50,
    EMERALD_600,
    GRAY_100,
    INDIGO_50,
    INDIGO_600,
    METAL,
    OFF_WHITE,
    PINK_50,
    PINK_600,
    SLATE_500,
    SLATE_900,
    WHITE,
    WHITE_90,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { HEADER_MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';

import BrandLogo from '../../../assets/svgs/BrandLogo';
import TemplateBox from '../../components/TemplateBox';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';
import OnboardingCarousel from '../../components/carousels/OnboardingCarousel';
import { ONBOARDING } from '../../navigation/ScreenNames';
import TemplateIcon from '../../components/TemplateIcon';
import { hp, wp } from '../../Utils/getResponsiveSize';
import useTranslation from '../../hooks/useTranslation';

const onboardingEducationImages = {
    deals: require('../../../assets/images/onboarding/deals.jpg'),
    matches: require('../../../assets/images/onboarding/matches.jpg'),
    aiTools: require('../../../assets/images/onboarding/ai-tools.jpg'),
    portfolio: require('../../../assets/images/onboarding/portfolio.jpg'),
    courses: require('../../../assets/images/onboarding/courses.jpg'),
};

const onboardingEducationMeta = {
    deals: {
        eyebrow: 'Paid brand deals',
        highlight: 'Apply faster',
        accentColor: INDIGO_600,
        badgeBackground: INDIGO_50,
        imageSurface: '#F7FAFF',
    },
    matches: {
        eyebrow: 'Smart brand matching',
        highlight: 'Higher fit',
        accentColor: EMERALD_600,
        badgeBackground: EMERALD_50,
        imageSurface: '#F4FCF7',
    },
    aiTools: {
        eyebrow: 'AI content workflow',
        highlight: 'Create faster',
        accentColor: PINK_600,
        badgeBackground: PINK_50,
        imageSurface: '#FFF6FB',
    },
    courses: {
        eyebrow: 'Creator education',
        highlight: 'Grow your rates',
        accentColor: AMBER_600,
        badgeBackground: AMBER_50,
        imageSurface: '#FFF9F2',
    },
    portfolio: {
        eyebrow: 'Professional profile',
        highlight: 'Build trust',
        accentColor: SLATE_900,
        badgeBackground: GRAY_100,
        imageSurface: '#F8FAFC',
    },
};

const OnboardingEducationScreen = ({ navigation }) => {
    const { onboardingEducation } = useFeatureFlags();
    const { t } = useTranslation();

    const onboardingContent = onboardingEducation?.content || [];
    const heroImageHeight = Math.min(SCREEN_HEIGHT * 0.4, hp(350));

    const [activeIndex, setActiveIndex] = useState(0);

    const carouselRef = React.useRef(null);
    const itemCount = onboardingContent.length;
    const currentSlideNumber = itemCount ? activeIndex + 1 : 0;

    const getImageSource = item => {
        if (item?.image) {
            return { uri: item.image };
        }

        if (item?.imageKey && onboardingEducationImages[item.imageKey]) {
            return onboardingEducationImages[item.imageKey];
        }

        return onboardingEducationImages.deals;
    };

    const getTranslatedValue = (translationKey, fallbackValue) => {
        return t(translationKey, { defaultValue: fallbackValue || '' });
    };

    const getSlideText = (item, field) => {
        if (!item?.imageKey) {
            return item?.[field] || '';
        }

        return getTranslatedValue(`onboarding.education.slides.${item.imageKey}.${field}`, item?.[field]);
    };

    const getSlideMeta = item => {
        const baseMeta = onboardingEducationMeta[item?.imageKey] || onboardingEducationMeta.deals;

        if (!item?.imageKey) {
            return baseMeta;
        }

        return {
            ...baseMeta,
            eyebrow: getTranslatedValue(`onboarding.education.meta.${item.imageKey}.eyebrow`, baseMeta.eyebrow),
            highlight: getTranslatedValue(`onboarding.education.meta.${item.imageKey}.highlight`, baseMeta.highlight),
        };
    };

    const handleNext = () => {
        const nextIndex = activeIndex + 1;

        if (itemCount === 0 || nextIndex >= itemCount) {
            navigation.navigate(ONBOARDING);
            return;
        }

        setActiveIndex(nextIndex);
        carouselRef?.current?.scrollToIndex?.({
            index: nextIndex,
            animated: true,
            useNativeDriver: true,
        });
    };

    return (
        <View style={styles.container}>
            <View pointerEvents="none" style={styles.topOrb} />
            <View pointerEvents="none" style={styles.bottomOrb} />

            <TemplateBox height={HEADER_MARGIN / 3} />

            <TemplateBox width={SCREEN_WIDTH} ph={wp(20)} mb={18} mt={HEADER_MARGIN / 2.5} selfCenter center />

            <TemplateBox flex width={SCREEN_WIDTH}>
                <OnboardingCarousel
                    showPagination
                    dots
                    data={onboardingContent}
                    renderItem={({ item, index }) => {
                        const slideMeta = getSlideMeta(item);
                        const isActive = index === activeIndex;

                        return (
                            <TemplateBox width={SCREEN_WIDTH} ph={wp(20)} pb={18}>
                                <TemplateBox
                                    backgroundColor={WHITE}
                                    borderRadius={34}
                                    ph={wp(22)}
                                    pt={22}
                                    pb={26}
                                    // shadow
                                    borderWidth={1}
                                    borderColor={BLACK_10}
                                    style={[styles.featureCard, !isActive && styles.inactiveCard]}
                                >
                                    <TemplateBox row justifyContent="space-between" alignItems="center" mb={18}>
                                        <TemplateBox
                                            row
                                            alignItems="center"
                                            backgroundColor={slideMeta.badgeBackground}
                                            borderRadius={18}
                                            ph={12}
                                            pv={8}
                                        >
                                            <View
                                                style={[styles.badgeDot, { backgroundColor: slideMeta.accentColor }]}
                                            />
                                            <TemplateText size={11} semiBold color={SLATE_900} style={styles.badgeText}>
                                                {slideMeta.eyebrow}
                                            </TemplateText>
                                        </TemplateBox>

                                        <TemplateBox backgroundColor={OFF_WHITE} borderRadius={16} ph={11} pv={7}>
                                            <TemplateText size={11} semiBold color={SLATE_500} style={styles.badgeText}>
                                                {slideMeta.highlight}
                                            </TemplateText>
                                        </TemplateBox>
                                    </TemplateBox>

                                    <TemplateBox
                                        width="100%"
                                        height={heroImageHeight}
                                        mb={22}
                                        justifyContent="center"
                                        alignItems="center"
                                        backgroundColor={slideMeta.imageSurface}
                                        borderRadius={26}
                                        borderWidth={1}
                                        borderColor={BLACK_10}
                                        overflow="hidden"
                                        style={styles.imageFrame}
                                    >
                                        <View style={[styles.imageGlow, { backgroundColor: slideMeta.accentColor }]} />
                                        <Image
                                            source={getImageSource(item)}
                                            resizeMode="contain"
                                            style={styles.image}
                                        />
                                    </TemplateBox>

                                    <TemplateText size={24} semiBold color={SLATE_900} lineHeight={31} style={styles.title}>
                                        {getSlideText(item, 'title')}
                                    </TemplateText>
                                    <TemplateBox height={12} />
                                    <TemplateText size={15} color={METAL} lineHeight={24} style={styles.message}>
                                        {getSlideText(item, 'message')}
                                    </TemplateText>
                                </TemplateBox>
                            </TemplateBox>
                        );
                    }}
                    paginationSize={onboardingContent?.length}
                    snapToInterval={SCREEN_WIDTH}
                    flex={1}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    ref={carouselRef}
                />
            </TemplateBox>

            <TemplateBox width={SCREEN_WIDTH} ph={wp(20)} pb={30} pt={8}>
                <TemplateBox
                    backgroundColor={WHITE_90}
                    borderRadius={30}
                    ph={14}
                    pt={14}
                    pb={14}
                    borderWidth={1}
                    borderColor={BLACK_10}
                >
                    <TemplateBox row justifyContent="space-between" alignItems="center">
                        <TemplateBox
                            backgroundColor={OFF_WHITE}
                            ph={30}
                            pv={18}
                            borderRadius={22}
                            onPress={() => navigation.navigate(ONBOARDING)}
                        >
                            <TemplateText size={14} semiBold caps color={SLATE_500} style={styles.actionLabel}>
                                {t('onboarding.education.skip')}
                            </TemplateText>
                        </TemplateBox>

                        <TemplateBox
                            backgroundColor={BLACK}
                            ph={32}
                            pv={18}
                            borderRadius={22}
                            row
                            center
                            onPress={handleNext}
                            style={styles.primaryAction}
                        >
                            <TemplateText color={WHITE} size={15} semiBold caps mr={15} style={styles.actionLabel}>
                                {t('onboarding.education.next')}
                            </TemplateText>
                            <TemplateIcon name="arrow-forward" color={WHITE} size={20} />
                        </TemplateBox>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FC',
        alignItems: 'center',
        overflow: 'hidden',
    },
    topOrb: {
        position: 'absolute',
        top: -SCREEN_WIDTH * 0.38,
        right: -SCREEN_WIDTH * 0.2,
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 0.9,
        borderRadius: SCREEN_WIDTH * 0.45,
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
    },
    bottomOrb: {
        position: 'absolute',
        bottom: -SCREEN_WIDTH * 0.4,
        left: -SCREEN_WIDTH * 0.18,
        width: SCREEN_WIDTH * 0.78,
        height: SCREEN_WIDTH * 0.78,
        borderRadius: SCREEN_WIDTH * 0.39,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    headerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: INDIGO_600,
        marginRight: 8,
    },
    kicker: {
        letterSpacing: 0.8,
    },
    progressTrack: {
        width: '100%',
        height: 8,
        borderRadius: 999,
        backgroundColor: '#E7ECF4',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: INDIGO_600,
    },
    featureCard: {
        minHeight: SCREEN_HEIGHT * 0.46,
    },
    inactiveCard: {
        opacity: 0.94,
    },
    badgeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    badgeText: {
        letterSpacing: 0.2,
    },
    imageFrame: {
        position: 'relative',
    },
    imageGlow: {
        position: 'absolute',
        width: '72%',
        height: '72%',
        borderRadius: 999,
        opacity: 0.1,
    },
    image: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    title: {
        width: '100%',
    },
    message: {
        width: '100%',
    },
    footerDot: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        marginRight: 10,
    },
    footerCopy: {
        flex: 1,
    },
    primaryAction: {
        minWidth: SCREEN_WIDTH * 0.42,
    },
    actionLabel: {
        letterSpacing: 0.6,
    },
});

export default OnboardingEducationScreen;
