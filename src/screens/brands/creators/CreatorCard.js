import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import {
    BLACK, BLACK_60, BLACK_SECONDARY, BRAND_BLUE, lightGreen, lightOrange, WHITE,
} from '../../../theme/Colors';
import { SHADOW } from '../../../theme/Shadow';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../consts/content/Portfolio';

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
    buttonOffset,
    active,
}) => (
    <TemplateBox
        width={width}
        borderRadius={20}
        pAll={16}
        selfCenter
        mt={SPACE_XXLARGE}
        style={[SHADOW('card', BRAND_BLUE), style]}
    >

        <TemplateBox row>
            <FastImage
                source={{ uri: imageUrl || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                style={[styles.image, imageStyle]}
                resizeMode="cover"
            />
            <TemplateBox width={textContainerWidth} height={60}>
                <TemplateText size={16} bold color={BLACK} numberOfLines={1}>{name}</TemplateText>
                <TemplateBox height={10} />
                <TemplateText
                    size={12}
                    color={BLACK_SECONDARY}
                    numberOfLines={2}
                >
                    {shortDescription}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>

        <TemplateBox row alignItems="center" mt={20}>
            <TemplateBox width={subtitleContainerWidth}>
                <TemplateBox row alignItems="center">
                    <TemplateIcon name="location-outline" color={BLACK_60} size={14} />
                    <TemplateText size={10} color={BLACK_60} semiBold>{location || 'London'}</TemplateText>
                </TemplateBox>

            </TemplateBox>

            <TemplateBox
                ph={WRAPPER_MARGIN - 5}
                pv={WRAPPER_MARGIN / 2}
                backgroundColor={BLACK}
                borderRadius={10}
                alignItems="center"
                justifyContent="center"
                onPress={onPress}
                left={buttonOffset}
            >
                <TemplateText color={WHITE} size={12} bold>View Portfolio</TemplateText>
            </TemplateBox>
        </TemplateBox>
        <TemplateBox
            ph={8}
            pv={4}
            backgroundColor={active ? lightGreen : lightOrange}
            borderRadius={6}
            alignItems="center"
            justifyContent="center"

        >
            <TemplateText color={WHITE} size={9} bold caps>{active ? 'Active' : 'Inactive'}</TemplateText>
        </TemplateBox>
    </TemplateBox>
);

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
    buttonOffset: PropTypes.number,
    active: PropTypes.bool,
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
    textContainerWidth: 190,
    subtitleContainerWidth: 100,
    buttonOffset: 80,
    active: true,
};

const styles = StyleSheet.create({
    image: {
        width: 90,
        height: 90,
        borderRadius: 20,
        marginRight: 20,
    },
});
export default CreatorCard;
