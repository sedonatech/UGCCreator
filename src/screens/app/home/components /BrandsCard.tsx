import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

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
    cardWidth?: number;
    aspectRatio?: number;
    slideInDelay?: number;
    titleSize?: number;
    descriptionLines?: number;
    descriptionSize?: number;

    onPress?: () => void;
}

const BrandsCard: FC<Props> = ({
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
        <BackgroundImage source={image} style={styles.image} width="100%" />
        <TemplateBox pAll={20} onPress={onPress}>
            {/* @ts-ignore */}
            <TemplateText color={WHITE} bold size={titleSize} style={styles.text}>
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
            {/* @ts-ignore */}
            <TemplateTouchable
                style={styles.viewOffersButton}
                onPress={onPress}
            >
                <TemplateText color={WHITE} bold size={14}>
                    View Offers
                </TemplateText>
            </TemplateTouchable>
        </TemplateBox>
    </TemplateBox>
);

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        zIndex: -1,
    },
    viewOffersButton: {
        backgroundColor: BLACK,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 10,
    },
    text: {
        marginBottom: 5,
    },
});

export default BrandsCard;
