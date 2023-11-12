import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK, BLACK_60, BRAND_BLUE, GREEN, WHITE,
} from '../../../../theme/Colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../../theme/Layout';
import TemplateIcon from '../../../../components/TemplateIcon';
import { wp } from '../../../../Utils/getResponsiveSize';

const CreatorDetailsHeader = ({
    userName, location, image,
}) => (
    <TemplateBox>
        <TemplateBox
            backgroundColor={BRAND_BLUE}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT * 0.24}
            borderBottomLeftRadius={20}
            borderBottomRightRadius={20}
            mb={userName ? 0 : wp(100)}
        >
            <TemplateBox
                absolute
                top={SCREEN_HEIGHT * 0.14}
                left={SCREEN_WIDTH * 0.5 - 102}
                borderWidth={10}
                backgroundColor={BRAND_BLUE}
                borderColor={WHITE}
                borderRadius={42}
                width={202}
                height={182}
                justifyContent="center"
                alignItems="center"
            >
                <FastImage source={{ uri: image }} style={styles.image} />
            </TemplateBox>
        </TemplateBox>
        <TemplateBox selfCenter slideIn slideInDelay={100} slideInDirection="left">
            {userName && (
                <TemplateBox row mt={120} alignItems="center" mb={6}>
                    <TemplateText bold size={20} color={BLACK} center>{userName}</TemplateText>
                    <TemplateIcon
                        name="check-decagram"
                        family="MaterialCommunity"
                        color={GREEN}
                        size={14}
                        style={styles.icon}
                    />
                </TemplateBox>
            )}
            {location && (
                <TemplateBox row alignItems="center">
                    <TemplateBox width={10} />
                    <TemplateBox row alignItems="center">
                        <TemplateIcon size={12} color={BLACK_60} name="location-outline" />
                        <TemplateText size={12} color={BLACK_60}>{location}</TemplateText>
                    </TemplateBox>
                </TemplateBox>
            )}
        </TemplateBox>
    </TemplateBox>
);

CreatorDetailsHeader.propTypes = {
    userName: PropTypes.string,
    location: PropTypes.string,
    image: PropTypes.string,
};

CreatorDetailsHeader.defaultProps = {
    userName: '',
    location: '',
    image: '',
};

const styles = StyleSheet.create({
    icon: {
        marginTop: 5.5,
    },
    image: {
        height: 176,
        width: 196,
        borderRadius: 40,
    },
});
export default CreatorDetailsHeader;
