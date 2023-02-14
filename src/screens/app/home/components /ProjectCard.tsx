import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { RADIUS_SMALL, SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    BLACK, WHITE, BLACK_30, BLACK_40
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import TemplateBox from '../../../../components/TemplateBox';

interface Props {
    image?: string | number;
    title?: string;
    shortDescription?: string;
    style?: any;

    slideInDelay?: number;

    onPress?: () => void;
}

const CARD_WIDTH = SCREEN_WIDTH / 2.36;
const ProjectCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    slideInDelay,
    onPress,
}) => (
    <TemplateBox
        mb={20}
        style={style}
        slideIn={slideInDelay !== undefined}
        slideInDelay={slideInDelay}
        width={CARD_WIDTH}
    >
        <TemplateBox
            width={CARD_WIDTH}
            aspectRatio={1.18}
            onPress={onPress}
        >
            <BackgroundImage source={image} style={styles.image} width={CARD_WIDTH} />
        </TemplateBox>
        {/* @ts-ignore */}
        <TemplateText color={BLACK} bold size={14} style={styles.text}>
            {title}
        </TemplateText>
        {/* @ts-ignore */}
        <TemplateText color={BLACK_40} size={12} style={styles.text} numberOfLines={2}>
            {shortDescription}
        </TemplateText>
    </TemplateBox>
);

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        width: '100%',
    },
    text: {
        marginTop: 4,
    }
});

export default ProjectCard;
