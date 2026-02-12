/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK, BLACK_30, BLACK_60, BLACK_SECONDARY, lightGreen, WHITE } from '../../../theme/Colors';
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
    textContainerWidth,
    subtitleContainerWidth,
    lastLoginTime,
    ctaText,
    height = wp(180),
    ...extraProps
}) => {
    const { t } = useTranslation();
    const displayCtaText = ctaText || t('creatorExplore.creators.viewProfile');

    return (
        <TemplateBox
            width={width}
            height={height}
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
                <TemplateBox flex={1} height={60} onPress={onPress}>
                    <TemplateText size={16} bold color={BLACK} numberOfLines={1}>
                        {name}
                    </TemplateText>
                    <TemplateBox height={10} />
                    <TemplateText size={12} color={BLACK_SECONDARY} numberOfLines={3}>
                        {shortDescription}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox row alignItems="center" mt={20} onPress={onPress}>
                <TemplateBox width={subtitleContainerWidth} onPress={onPress}>
                    <TemplateBox row alignItems="center">
                        <TemplateIcon name="location-outline" color={BLACK_60} size={14} />
                        <TemplateText size={10} color={BLACK_60} semiBold>
                            {location || 'London'}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
            <TemplateBox row alignItems="center" justifyContent="space-between" width={width - wp(32)}>
                <TemplateBox
                    ph={8}
                    pv={4}
                    backgroundColor={lightGreen}
                    borderRadius={6}
                    alignItems="center"
                    justifyContent="center"
                    onPress={onPress}
                >
                    <TemplateText color={WHITE} size={wp(9)} semiBold>
                        {`${t('creatorExplore.creators.active')} ${lastLoginTime}`}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox
                    ph={wp(WRAPPER_MARGIN - 5)}
                    pv={wp(WRAPPER_MARGIN / 2)}
                    backgroundColor={BLACK}
                    borderRadius={wp(10)}
                    alignItems="center"
                    justifyContent="center"
                    onPress={onPress}
                    alignSelf="flex-end"
                    mb={wp(12)}
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
    textContainerWidth: PropTypes.number,
    subtitleContainerWidth: PropTypes.number,
    lastLoginTime: PropTypes.string,
    height: PropTypes.number,
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
    textContainerWidth: wp(190),
    subtitleContainerWidth: wp(100),
    lastLoginTime: 'days ago',
    height: wp(180),
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
