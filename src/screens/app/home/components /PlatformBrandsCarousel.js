import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLUE_500,
    DARK_METAL,
    IOS_BLUE,
    IOS_BLUE_20,
    LIGHT_GREEN_10,
    METAL,
    WHITE,
} from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { BRAND_APPLICATIONS, PLATFORM_BRANDS_SCREEN, WEBVIEW } from '../../../../navigation/ScreenNames';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../../Utils/getResponsiveSize';
import { getCapitalizedFirstLetter } from '../../../../Utils/texts';
import DynamicIcon from '../../../../components/icons/DynamicIcon';
import TemplateIcon from '../../../../components/TemplateIcon';
import WebsitePreview, { preloadWebsitePreviews } from './WebsitePreview';
import useTranslation from '../../../../hooks/useTranslation';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import useTrackEvent from '../../../../hooks/events/useTrackEvent';
import { createBrandApplication, getMyBrandApplications } from '../../../../lib/brandApplications';
import useMailCompose from '../../../../hooks/documents/useMailCompose';

const getLocalizedDescription = (item, language) => {
    const key = `description_${language.replace('-', '_')}`;
    return item?.[key] || item?.description;
};

const buildEmailBody = (brandName, userName, t) => {
    const intro = userName
        ? t('home.platformBrandsCarousel.emailIntro', { userName })
        : t('home.platformBrandsCarousel.emailIntroDefault');
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
        t('home.platformBrandsCarousel.emailRegards'),
        userName || '',
    ].join('\n');
};

const PlatformBrandsCarousel = ({ style }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { platformBrands } = useFeatureFlags();
    const brands = platformBrands?.brands;
    const { auth } = useAuthContext();
    const { trackEvent } = useTrackEvent();
    const { sendEmailWithAttachment } = useMailCompose();
    const profile = auth?.profile;
    const uid = profile?.id;

    const [appliedBrands, setAppliedBrands] = useState({});

    const refreshApplications = useCallback(async () => {
        if (!uid) return;
        try {
            const apps = await getMyBrandApplications(uid);
            const map = {};
            apps.forEach(app => {
                map[app.link] = true;
            });
            setAppliedBrands(map);
        } catch (e) {
            // silent
        }
    }, [uid]);

    useEffect(() => {
        refreshApplications();
    }, [refreshApplications]);

    const randomFourBrands = useMemo(() => {
        if (!brands) return [];
        if (brands.length <= 4) return brands;
        const shuffled = [...brands].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [brands]);

    useEffect(() => {
        if (randomFourBrands?.length) {
            preloadWebsitePreviews(randomFourBrands.map(b => b?.link));
        }
    }, [randomFourBrands]);

    const handleApply = item => {
        if (!item?.email) return;

        const mediaKitUrl = profile?.mediaKit?.url;
        const attachments = mediaKitUrl
            ? [{ uri: mediaKitUrl, mimeType: 'application/pdf', name: 'media-kit.pdf' }]
            : [];

        const metaData = {
            recipients: [item.email],
            subject: t('home.platformBrandsCarousel.emailSubject', { brandName: item.name }),
            body: buildEmailBody(item.name, profile?.userName, t),
            attachments,
        };

        trackEvent('brand_apply_with_media_kit', { brandName: item.name });

        sendEmailWithAttachment(metaData);

        // Track the application
        if (uid && item?.link) {
            createBrandApplication({
                ownerId: uid,
                brandName: item.name,
                link: item.link,
                status: 'applied',
            })
                .then(() => {
                    setAppliedBrands(prev => ({ ...prev, [item.link]: true }));
                    Toast.show({
                        type: 'success',
                        text1: t('home.platformBrandsCarousel.applicationTracked'),
                    });
                })
                .catch(() => {
                    setAppliedBrands(prev => ({ ...prev, [item.link]: true }));
                });
        }
    };

    if (!brands?.length) return null;

    return (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={10}>
                <TemplateBox width={SCREEN_WIDTH * 0.8}>
                    <TemplateText size={16} semiBold>
                        {t('home.platformBrandsCarousel.title')}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox flex />
                <TemplateTouchable onPress={() => navigation.navigate(PLATFORM_BRANDS_SCREEN)}>
                    <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                        {t('home.platformBrandsCarousel.seeAll')}
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>
            <TemplateBox mh={WRAPPER_MARGIN} mb={16}>
                <TemplateText size={13} color={BLACK}>
                    {t('home.platformBrandsCarousel.description')}
                </TemplateText>
            </TemplateBox>

            {/* View Applications link */}
            <TemplateBox
                row
                alignItems="center"
                mh={WRAPPER_MARGIN}
                mb={12}
                onPress={() => {
                    trackEvent('view_applications_tapped', { source: 'carousel' });
                    navigation.navigate(BRAND_APPLICATIONS);
                }}
            >
                <TemplateIcon name="cash-outline" color={BLUE_500} size={16} />
                <TemplateText size={14} color={BLUE_500} medium ml={6}>
                    {t('home.platformBrandsCarousel.viewApplications')}
                </TemplateText>
                <DynamicIcon name="ArrowRight" color={BLUE_500} size={16} />
            </TemplateBox>

            <TemplateCarousel
                data={randomFourBrands}
                renderItem={({ item }) => {
                    const alreadyApplied = appliedBrands[item?.link];
                    return (
                        <TemplateBox
                            borderRadius={wp(16)}
                            pAll={wp(16)}
                            style={styles.card}
                            width={WRAPPED_SCREEN_WIDTH - 20}
                            mr={wp(16)}
                            borderWidth={1}
                            borderColor={BLACK_20}
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

                            {/* Website Preview */}
                            <TemplateBox mv={10}>
                                <WebsitePreview
                                    url={item?.link}
                                    category={item?.category}
                                    brandName={item?.name}
                                    height={120}
                                />
                            </TemplateBox>

                            {/* Description */}
                            <TemplateText size={14} numberOfLines={2} mb={10} color={METAL}>
                                {getLocalizedDescription(item, language)}
                            </TemplateText>

                            {/* Email row */}
                            {item?.email && (
                                <TemplateBox
                                    row
                                    alignItems="center"
                                    mb={10}
                                    onPress={() => Linking.openURL(`mailto:${item.email}`)}
                                >
                                    <TemplateIcon name="mail-outline" color={DARK_METAL} size={14} />
                                    <TemplateText size={12} color={DARK_METAL} ml={6} numberOfLines={1}>
                                        {item.email}
                                    </TemplateText>
                                </TemplateBox>
                            )}

                            <TemplateBox height={1} width="98%" backgroundColor={BLACK_10} selfCenter mv={4} />

                            {/* Actions */}
                            <TemplateBox row alignItems="center" justifyContent="space-between" mt={10}>
                                {item?.email && (
                                    <TemplateBox
                                        pv={6}
                                        ph={12}
                                        borderRadius={8}
                                        backgroundColor={alreadyApplied ? `${BLUE_500}15` : LIGHT_GREEN_10}
                                        onPress={() => handleApply(item)}
                                    >
                                        <TemplateText size={12} medium color={alreadyApplied ? BLUE_500 : DARK_METAL}>
                                            {alreadyApplied
                                                ? t('home.platformBrandsCarousel.alreadyApplied')
                                                : t('home.platformBrandsCarousel.applyWithMediaKit')}
                                        </TemplateText>
                                    </TemplateBox>
                                )}
                                <TemplateBox
                                    row
                                    alignItems="center"
                                    onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
                                >
                                    <TemplateText size={14} color={BLUE_500} medium>
                                        {t('home.platformBrandsCarousel.visitWebsite')}
                                    </TemplateText>
                                    <DynamicIcon name="ArrowRight" color={BLUE_500} />
                                </TemplateBox>
                            </TemplateBox>
                        </TemplateBox>
                    );
                }}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={SCREEN_WIDTH / 1.6}
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        backgroundColor: WHITE,
        borderColor: BLACK_20,
        borderWidth: 1.2,
        shadowColor: BLACK,
    },
});

PlatformBrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

PlatformBrandsCarousel.defaultProps = {
    style: {},
};

export default PlatformBrandsCarousel;
