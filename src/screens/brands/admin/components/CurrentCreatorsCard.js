import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import {
    BLACK_60, BLUE, GREEN, WHITE,
} from '../../../../theme/Colors';
import { RADIUS_SMALL, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../../consts/content/Portfolio';

const defaultCardWidth = SCREEN_WIDTH / 1.3;
const defaultAspectRatio = 1.6;
const CurrentCreatorsCard = ({
    image, name, shortDescription, style, onPress, cardWidth, aspectRatio, onViewCreatorPress,
}) => (
    <TemplateBox
        fullGradient={!!image}
        alignItems="center"
        justifyContent="center"
        gradientColors={[BLACK_60, BLACK_60]}
        borderRadius={RADIUS_SMALL}
        width={cardWidth}
        aspectRatio={aspectRatio}
        style={style}
    >
        <BackgroundImage source={{ uri: image }} style={styles.image} width={SCREEN_WIDTH} />
        <TemplateBox pAll={20} mt={WRAPPER_MARGIN} width="100%">
            <TemplateText color={WHITE} bold size={16} style={styles.text}>
                {name}
            </TemplateText>
            <TemplateBox height={10} />
            <TemplateText
                color={WHITE}
                size={14}
                style={styles.text}
                numberOfLines={2}
            >
                {shortDescription || DEFAULT_CREATOR_SHORT_DESCRIPTION}
            </TemplateText>
            <TemplateBox height={20} />
            <TemplateBox
                alignItems="center"
                justifyContent="center"
                borderRadius={RADIUS_SMALL}
                backgroundColor={GREEN}
                width={160}
                pv={10}
                onPress={onPress}
                selfCenter
                mb={8}
            >
                <TemplateText color={WHITE} bold size={12}>
                    View Project Status
                </TemplateText>
            </TemplateBox>
            {!!onViewCreatorPress
                && (
                    <TemplateBox
                        alignItems="center"
                        justifyContent="center"
                        borderRadius={RADIUS_SMALL}
                        backgroundColor={BLUE}
                        width={160}
                        pv={10}
                        onPress={onViewCreatorPress}
                        selfCenter
                    >
                        <TemplateText color={WHITE} bold size={12}>
                            View Creator
                        </TemplateText>
                    </TemplateBox>
                )}
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
    cardWidth: PropTypes.number,
    aspectRatio: PropTypes.number,
};

CurrentCreatorsCard.defaultProps = {
    image: '',
    name: '',
    shortDescription: '',
    style: {},
    onPress: () => {},
    cardWidth: defaultCardWidth,
    aspectRatio: defaultAspectRatio,
};
export default CurrentCreatorsCard;
