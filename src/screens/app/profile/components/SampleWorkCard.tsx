import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { RADIUS_SMALL, SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    WHITE, BLACK_40, WHITE_30, BLACK
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';

import TemplateBox from '../../../../components/TemplateBox';
import TemplateIcon from '../../../../components/TemplateIcon';

interface Props {
    image?: string | number;
    title?: string;
    shortDescription?: string;
    style?: any;
    cardWidth?: number;
    aspectRatio?: number;
    slideInDelay?: number;
    titleSize?: number;
    descriptionLines?: number;
    descriptionSize?: number;
    onPress?: () => void;
    icon?: string;
    titleLines?: number;
}

const SampleWorkCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    cardWidth = SCREEN_WIDTH / 1.6,
    aspectRatio = 1.5,
    slideInDelay,
    titleSize = 18,
    descriptionLines = 2,
    descriptionSize = 14,
    onPress,
    icon,
    titleLines
}) => (
    <TemplateBox
        fullGradient
        alignItems="center"
        justifyContent="center"
        gradientColors={[BLACK_40, BLACK_40]}
        borderRadius={RADIUS_SMALL}
        width={cardWidth}
        aspectRatio={aspectRatio}
        style={style}
        slideIn={slideInDelay !== undefined}
        slideInDelay={slideInDelay}
    >
        <BackgroundImage source={image} style={styles.image} width={SCREEN_WIDTH} />
        <TemplateBox pAll={20} onPress={onPress}>
            {icon && (
                <TemplateBox
                    height={30}
                    width={30}
                    absolute
                    top={-12}
                    left={SCREEN_WIDTH - 190}
                    borderRadius={10}
                    backgroundColor={WHITE_30}
                    alignItems="center"
                    justifyContent="center"
                >
                    <TemplateIcon name={icon} size={18} color={BLACK} />
                </TemplateBox>
            )}
            {/* @ts-ignore */}
            <TemplateText
                color={WHITE}
                bold
                size={titleSize}
                style={styles.text}
                numberOfLines={titleLines}
            >
                {title}
            </TemplateText>
            {/* @ts-ignore */}
            <TemplateText
                color={WHITE}
                size={descriptionSize}
                // @ts-ignore
                style={styles.text}
                numberOfLines={descriptionLines}
            >
                {shortDescription}
            </TemplateText>
        </TemplateBox>
    </TemplateBox>
);

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        zIndex: -1,
    },

    text: {
        marginBottom: 5,
    },
});

export default SampleWorkCard;
