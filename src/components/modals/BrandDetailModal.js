import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import ModalBase from './ModalBase';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';
import TemplateIcon from '../TemplateIcon';
import Button from '../Button';
import DynamicIcon from '../icons/DynamicIcon';
import { BLACK, BLACK_10, BLUE_500, DARK_METAL, IOS_BLUE_20, LIGHT_GREEN_10, METAL, WHITE } from '../../theme/Colors';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import { wp } from '../../Utils/getResponsiveSize';
import { getCapitalizedFirstLetter } from '../../Utils/texts';
import WebsitePreview from '../../screens/app/home/components /WebsitePreview';
import useTranslation from '../../hooks/useTranslation';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';

const BrandDetailModal = ({ visible, brand, onClose, onApply, onVisitWebsite, alreadyApplied, loading }) => {
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { platformBrands } = useFeatureFlags();
    const ugcMessages = platformBrands?.ugcMessages;

    const getLocalizedField = (obj, field) => {
        const langKey = `${field}_${language.replace('-', '_')}`;
        return obj?.[langKey] || obj?.[field];
    };

    const ugcMessage = ugcMessages?.[brand?.category];

    const getLocalizedDescription = item => getLocalizedField(item, 'description');

    if (!brand) return null;

    return (
        <ModalBase visible={visible} closeOnPress={onClose} animationInTiming={300}>
            <TemplateBox
                borderRadius={20}
                selfCenter
                backgroundColor={WHITE}
                width={SCREEN_WIDTH * 0.92}
                height="85%"
                style={styles.modal}
            >
                {/* Close button */}
                <TemplateBox
                    absolute
                    top={12}
                    right={12}
                    zIndex={10}
                    height={32}
                    width={32}
                    borderRadius={16}
                    backgroundColor={BLACK_10}
                    alignItems="center"
                    justifyContent="center"
                    onPress={onClose}
                >
                    <TemplateIcon name="close" color={DARK_METAL} size={18} />
                </TemplateBox>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                >
                    {/* Header: avatar + name + category */}
                    <TemplateBox row alignItems="center" mb={16}>
                        <TemplateBox
                            height={56}
                            width={56}
                            mr={12}
                            borderRadius={14}
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={LIGHT_GREEN_10}
                            shadow
                            shadowColor={BLACK}
                        >
                            <TemplateText startCase size={24} bold color={DARK_METAL}>
                                {getCapitalizedFirstLetter(brand?.name)}
                            </TemplateText>
                        </TemplateBox>

                        <TemplateBox flex={1}>
                            <TemplateText startCase size={20} bold numberOfLines={2} color={BLACK}>
                                {brand?.name}
                            </TemplateText>
                            <TemplateBox
                                pv={3}
                                ph={10}
                                borderRadius={8}
                                backgroundColor={IOS_BLUE_20}
                                alignSelf="flex-start"
                                mt={4}
                            >
                                <TemplateText size={11} medium>
                                    {brand?.category}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    </TemplateBox>

                    {/* Website Preview */}
                    <TemplateBox mb={16} borderRadius={12} overflow="hidden">
                        <WebsitePreview
                            url={brand?.link}
                            category={brand?.category}
                            brandName={brand?.name}
                            height={180}
                        />
                    </TemplateBox>

                    {/* Description */}
                    {getLocalizedDescription(brand) && (
                        <TemplateBox mb={16}>
                            <TemplateText size={14} color={METAL} lineHeight={20}>
                                {getLocalizedDescription(brand)}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    {/* Email row */}
                    {brand?.email && (
                        <TemplateBox
                            row
                            alignItems="center"
                            mb={16}
                            pAll={12}
                            borderRadius={10}
                            backgroundColor={LIGHT_GREEN_10}
                        >
                            <TemplateIcon name="mail-outline" color={DARK_METAL} size={16} />
                            <TemplateText size={13} color={DARK_METAL} ml={8} numberOfLines={1} flex={1}>
                                {brand.email}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    <TemplateBox height={1} width="100%" backgroundColor={BLACK_10} mv={4} />

                    {/* UGC Message */}
                    {ugcMessage && (
                        <TemplateBox
                            mt={16}
                            pAll={16}
                            borderRadius={14}
                            backgroundColor="#F0F7FF"
                            borderWidth={1}
                            borderColor={`${BLUE_500}20`}
                        >
                            <TemplateBox row alignItems="center" mb={8}>
                                <TemplateText size={16}>✨</TemplateText>
                                <TemplateText size={15} bold color={BLUE_500} ml={6}>
                                    {getLocalizedField(ugcMessage, 'headline')}
                                </TemplateText>
                            </TemplateBox>
                            <TemplateText size={13} color={DARK_METAL} lineHeight={20}>
                                {getLocalizedField(ugcMessage, 'body')}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    {/* Action Buttons */}
                    <TemplateBox mt={20} mb={10} alignItems="center">
                        <Button
                            title={
                                loading
                                    ? t('home.platformBrandsCarousel.attachingMediaKit')
                                    : alreadyApplied
                                    ? t('home.platformBrandsCarousel.alreadyApplied')
                                    : t('home.platformBrandsCarousel.applyWithMediaKit')
                            }
                            onPress={onApply}
                            disabled={loading}
                            color={loading ? `${BLUE_500}50` : alreadyApplied ? `${BLUE_500}30` : BLUE_500}
                            titleColor={alreadyApplied ? BLUE_500 : WHITE}
                            width={SCREEN_WIDTH * 0.92 - WRAPPER_MARGIN * 2 - 32}
                            height={wp(48)}
                            style={styles.applyButton}
                        />

                        {brand?.link ? (
                            <TemplateBox
                                row
                                alignItems="center"
                                justifyContent="center"
                                mt={12}
                                pv={12}
                                onPress={onVisitWebsite}
                            >
                                <TemplateText size={15} color={BLUE_500} medium>
                                    {t('home.platformBrandsCarousel.visitWebsite')}
                                </TemplateText>
                                <DynamicIcon name="ArrowRight" color={BLUE_500} />
                            </TemplateBox>
                        ) : null}
                    </TemplateBox>
                </ScrollView>
            </TemplateBox>
        </ModalBase>
    );
};

const styles = StyleSheet.create({
    modal: {
        marginTop: 'auto',
        marginBottom: 'auto',
        overflow: 'hidden',
    },
    scrollContent: {
        padding: WRAPPER_MARGIN,
        paddingTop: WRAPPER_MARGIN + 16,
    },
    applyButton: {
        borderRadius: 14,
    },
});

BrandDetailModal.propTypes = {
    visible: PropTypes.bool,
    brand: PropTypes.shape({
        name: PropTypes.string,
        category: PropTypes.string,
        link: PropTypes.string,
        email: PropTypes.string,
        description: PropTypes.string,
    }),
    onClose: PropTypes.func,
    onApply: PropTypes.func,
    onVisitWebsite: PropTypes.func,
    alreadyApplied: PropTypes.bool,
    loading: PropTypes.bool,
};

BrandDetailModal.defaultProps = {
    visible: false,
    brand: null,
    onClose: () => {},
    onApply: () => {},
    onVisitWebsite: () => {},
    alreadyApplied: false,
    loading: false,
};

export default BrandDetailModal;
