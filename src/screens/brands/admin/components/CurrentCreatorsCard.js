import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import {
    BLACK_40, GREEN, WHITE,
} from '../../../../theme/Colors';
import { RADIUS_SMALL, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../../consts/content/Portfolio';

const cardWidth = SCREEN_WIDTH / 1.3;
const aspectRatio = 1;
const CurrentCreatorsCard = ({
    image, name, shortDescription, style, onPress,
}) => (
    <TemplateBox
        fullGradient={!!image}
        alignItems="center"
        justifyContent="center"
        gradientColors={[BLACK_40, BLACK_40]}
        borderRadius={RADIUS_SMALL}
        width={cardWidth}
        aspectRatio={aspectRatio}
        style={style}
    >
        <BackgroundImage source={{ uri: image }} style={styles.image} width="100%" />
        <TemplateBox pAll={20} onPress={onPress} mt={WRAPPER_MARGIN}>
            <TemplateText color={WHITE} bold size={20} style={styles.text}>
                {name}
            </TemplateText>
            <TemplateBox height={10} />
            <TemplateText
                color={WHITE}
                size={16}
                style={styles.text}
                numberOfLines={4}
            >
                {shortDescription || DEFAULT_CREATOR_SHORT_DESCRIPTION}
            </TemplateText>
            <TemplateBox height={86} />
            <TemplateBox
                alignItems="center"
                justifyContent="center"
                borderRadius={RADIUS_SMALL}
                backgroundColor={GREEN}
                width={240}
                pv={16}
                onPress={onPress}
                selfCenter
            >
                <TemplateText color={WHITE} bold size={14}>
                    View Project Status
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
    </TemplateBox>
);

const styles = StyleSheet.create({
    image: {
        borderRadius: RADIUS_SMALL,
        zIndex: -1,
    },
});

CurrentCreatorsCard.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    shortDescription: PropTypes.string,
    style: PropTypes.shape({}),
    onPress: PropTypes.func,
};

CurrentCreatorsCard.defaultProps = {
    image: '',
    name: '',
    shortDescription: '',
    style: {},
    onPress: () => {},
};
export default CurrentCreatorsCard;
