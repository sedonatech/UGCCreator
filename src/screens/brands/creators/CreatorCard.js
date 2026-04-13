/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK, BLACK_30, BLACK_60, BLACK_SECONDARY, WHITE } from '../../../theme/Colors';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../consts/content/Portfolio';
import { wp } from '../../../Utils/getResponsiveSize';
import useTranslation from '../../../hooks/useTranslation';

const CreatorCard = ({
    name,
    imageUrl,
    shortDescription,
    location,
    onPress,
    style,
    width,
    imageStyle,
    ctaText,
    ...extraProps
}) => {
    const { t } = useTranslation();
    const displayCtaText = ctaText || t('creatorExplore.creators.viewProfile');

    return (
        <TemplateBox
            width={width}
            borderRadius={20}
            borderWidth={StyleSheet.hairlineWidth}
            borderColor={BLACK_30}
            pAll={16}
            mh={WRAPPER_MARGIN}
            mt={SPACE_XXLARGE}
            style={style}
            onPress={onPress}
            {...extraProps}
        >
            <TemplateBox row onPress={onPress}>
                <FastImage
                    source={{ uri: imageUrl || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                    style={[styles.image, imageStyle]}
                />
                <TemplateBox flex={1} justifyContent="center" onPress={onPress}>
                    <TemplateText size={16} bold color={BLACK} numberOfLines={1}>
                        {name}
                    </TemplateText>
                    <TemplateBox height={4} />
                    <TemplateText size={12} color={BLACK_SECONDARY} numberOfLines={2}>
                        {shortDescription}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox row alignItems="center" justifyContent="space-between" mt={12}>
                {!!location && (
                    <TemplateBox row alignItems="center" flex={1}>
                        <TemplateIcon name="location-outline" color={BLACK_60} size={14} />
                        <TemplateText size={11} color={BLACK_60} semiBold ml={2}>
                            {location}
                        </TemplateText>
                    </TemplateBox>
                )}
                <TemplateBox
                    ph={wp(14)}
                    pv={wp(8)}
                    backgroundColor={BLACK}
                    borderRadius={wp(10)}
                    alignItems="center"
                    justifyContent="center"
                    onPress={onPress}
                >
                    <TemplateText color={WHITE} size={wp(10)} bold>
                        {displayCtaText}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );
};

CreatorCard.propTypes = {
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    shortDescription: PropTypes.string,
    location: PropTypes.string,
    onPress: PropTypes.func,
    style: PropTypes.shape({}),
    width: PropTypes.number,
    imageStyle: PropTypes.shape({}),
    ctaText: PropTypes.string,
};

CreatorCard.defaultProps = {
    name: '',
    imageUrl: '',
    shortDescription: '',
    location: '',
    onPress: () => {},
    style: {},
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
    imageStyle: {},
    ctaText: undefined,
};

const styles = StyleSheet.create({
    image: {
        width: wp(90),
        height: wp(90),
        borderRadius: wp(20),
        marginRight: wp(20),
    },
});
export default CreatorCard;
