import React, { useMemo } from 'react';
import { StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLUE_500,
    DARK_METAL,
    FUCSHIA_500,
    IOS_BLUE,
    IOS_BLUE_20,
    LIGHT_GREEN_10,
    METAL,
    WHITE,
} from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { AFFILIATE_BRANDS, BRAND_APPLICATIONS, WEBVIEW } from '../../../../navigation/ScreenNames';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../../Utils/getResponsiveSize';
import { getCapitalizedFirstLetter } from '../../../../Utils/texts';
import DynamicIcon from '../../../../components/icons/DynamicIcon';
import useTranslation from '../../../../hooks/useTranslation';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import { createBrandApplication } from '../../../../lib/brandApplications';

const AffiliateBrandsCarousel = ({ style }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { auth } = useAuthContext();
    const { affiliate } = useFeatureFlags();
    const affiliateBrands = affiliate?.brands;

    const handleTrackApplication = async (item) => {
        const uid = auth?.profile?.id;
        if (!uid) {
            Alert.alert('Error', 'Please log in to track applications.');
            return;
        }
        try {
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

    const randomFourBrands = useMemo(() => {
        if (!affiliateBrands) return [];
        if (affiliateBrands.length <= 4) return affiliateBrands;
        const shuffled = [...affiliateBrands].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [affiliateBrands]);

    return (
        <TemplateBox style={style}>
            {affiliateBrands && (
                <TemplateBox>
                    <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={10}>
                        <TemplateBox width={SCREEN_WIDTH * 0.8}>
                            <TemplateText size={16} semiBold>
                                {t('home.affiliateBrandsCarousel.title')}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox flex />
                        <TemplateTouchable
                            onPress={() =>
                                navigation.navigate(AFFILIATE_BRANDS, {
                                    title: t('home.affiliateBrandsCarousel.title'),
                                    subtitle: t('home.affiliateBrandsCarousel.subtitle'),
                                })
                            }
                        >
                            <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                                {t('home.affiliateBrandsCarousel.seeAll')}
                            </TemplateText>
                        </TemplateTouchable>
                    </TemplateBox>
                    <TemplateBox mh={WRAPPER_MARGIN} mb={16}>
                        <TemplateText size={13} color={BLACK}>
                            {t('home.affiliateBrandsCarousel.description')}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox mh={WRAPPER_MARGIN} mb={12}>
                        <TemplateBox
                            row
                            alignItems="center"
                            alignSelf="flex-start"
                            pv={8}
                            ph={14}
                            borderRadius={10}
                            backgroundColor={`${FUCSHIA_500}15`}
                            onPress={() => navigation.navigate(BRAND_APPLICATIONS)}
                        >
                            <DynamicIcon name="List" color={FUCSHIA_500} size={16} />
                            <TemplateText size={12} semiBold color={FUCSHIA_500} ml={6}>
                                View Application Tracker
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                </TemplateBox>
            )}

            <TemplateCarousel
                data={randomFourBrands}
                renderItem={({ item }) => (
                    <TemplateBox
                        borderRadius={wp(16)}
                        pAll={wp(16)}
                        style={styles.card}
                        width={WRAPPED_SCREEN_WIDTH - 20}
                        mr={wp(16)}
                        borderWidth={1}
                        borderColor={BLACK_20}
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
                        <TemplateBox
                            row
                            alignItems="center"
                            justifyContent="space-between"
                        >
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
                                onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
                            >
                                <TemplateText size={14} color={BLUE_500} medium>
                                    {t('home.affiliateBrandsCarousel.viewDetails')}
                                </TemplateText>
                                <DynamicIcon name="ArrowRight" color={BLUE_500} />
                            </TemplateBox>
                        </TemplateBox>
                    </TemplateBox>
                )}
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

AffiliateBrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

AffiliateBrandsCarousel.defaultProps = {
    style: {},
};

export default AffiliateBrandsCarousel;
