import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import {
    BLACK, BLACK_40, BLACK_SECONDARY, GREY_SECONDARY, WHITE,
} from '../../../theme/Colors';
import { DEFAULT_AVATARS } from '../../../consts/content/Home';
import { SHADOW } from '../../../theme/Shadow';

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
}) => (
    <TemplateBox
        width={width}
        borderRadius={20}
        pAll={WRAPPER_MARGIN}
        selfCenter
        mt={SPACE_XXLARGE}
        style={[SHADOW('card', WHITE), style]}
    >

        <TemplateBox row>
            <FastImage
                source={{ uri: imageUrl || DEFAULT_AVATARS[1] }}
                style={[styles.image, imageStyle]}
            />
            <TemplateBox width={textContainerWidth}>
                <TemplateText size={20} bold color={BLACK}>{name}</TemplateText>
                <TemplateBox height={10} />
                <TemplateText
                    size={13}
                    color={BLACK_SECONDARY}
                    numberOfLines={2}
                >
                    {shortDescription}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
        <TemplateBox
            selfCenter
            width="96%"
            height={1}
            backgroundColor={BLACK_40}
            mv={WRAPPER_MARGIN}
        />

        <TemplateBox row alignItems="center">
            <TemplateBox width={subtitleContainerWidth}>
                <TemplateBox row alignItems="center">
                    <TemplateIcon name="location-outline" color={BLACK_40} size={20} />
                    <TemplateBox width={5} />
                    <TemplateText size={14} color={BLACK}>{location || 'South Africa'}</TemplateText>
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
