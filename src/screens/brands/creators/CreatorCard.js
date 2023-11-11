import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import {
    BLACK, BLACK_60, BLACK_SECONDARY, WHITE,
} from '../../../theme/Colors';
import { SHADOW } from '../../../theme/Shadow';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../consts/content/Portfolio';
import { wp } from '../../../Utils/getResponsiveSize';

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
}) => (
    <TemplateBox
        width={width}
        height={wp(180)}
        borderRadius={20}
        pAll={16}
        selfCenter
        mt={SPACE_XXLARGE}
        style={[style, { backgroundColor: WHITE }]}
        onPress={onPress}
    >

        <TemplateBox
            row
            onPress={onPress}
        >
            <FastImage
                source={{ uri: imageUrl || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                style={[styles.image, imageStyle]}

            />
            <TemplateBox
                width={textContainerWidth}
                height={60}
                onPress={onPress}
            >
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

        <TemplateBox
            row
            alignItems="center"
            mt={20}
            onPress={onPress}
        >
            <TemplateBox
                width={subtitleContainerWidth}
                onPress={onPress}
            >
                <TemplateBox row alignItems="center">
                    <TemplateIcon name="location-outline" color={BLACK_60} size={14} />
                    <TemplateText size={10} color={BLACK_60} semiBold>{location || 'London'}</TemplateText>
                </TemplateBox>

            </TemplateBox>

            <TemplateBox
                ph={wp(WRAPPER_MARGIN - 5)}
                pv={wp(WRAPPER_MARGIN / 2)}
                backgroundColor={BLACK}
                borderRadius={wp(10)}
                alignItems="center"
                justifyContent="center"
                onPress={onPress}
                ml={wp(10)}
            >
                <TemplateText color={WHITE} size={wp(12)} bold>View Portfolio</TemplateText>
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
};

const styles = StyleSheet.create({
    image: {
        width: wp(90),
        height: wp(90),
        borderRadius: wp(20),
        marginRight: wp(20),
    },
});
export default memo(CreatorCard);
