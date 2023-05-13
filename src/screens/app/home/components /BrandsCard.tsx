import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { RADIUS_SMALL, SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    BLACK, WHITE, BRAND_BLUE, TRANSPARENT, BLACK_50, DEFAULT_GRADIENT, lightGreen, lightOrange,
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import TemplateBox from '../../../../components/TemplateBox';

interface Props {
    image?: string | number | any;
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
    buttonTitle?: string;
    active?: boolean;
    showActive?: boolean;
}

const BrandsCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    cardWidth = SCREEN_WIDTH / 1.6,
    aspectRatio = 1.36,
    slideInDelay,
    titleSize = 16,
    descriptionLines = 2,
    descriptionSize = 12,
    onPress,
    buttonTitle = 'View Brand Offers',
    active,
    showActive = false
}) => (
    <TemplateBox
        fullGradient={!!image}
        alignItems="center"
        justifyContent="center"
        gradientColors={image ? DEFAULT_GRADIENT : [TRANSPARENT, TRANSPARENT]}
        borderRadius={RADIUS_SMALL}
        width={cardWidth}
        aspectRatio={aspectRatio}
        style={style}
        slideIn={slideInDelay !== undefined}
        slideInDelay={slideInDelay}
        shadow
    >
        {
            image ? (
                <BackgroundImage source={image} style={styles.image} width="100%" />
            ) : (
                <TemplateBox
                    backgroundColor={BRAND_BLUE}
                    width={cardWidth}
                    aspectRatio={aspectRatio}
                    absolute
                    borderRadius={RADIUS_SMALL}
                />
            )
        }
        {showActive && (
            <TemplateBox
                mt={20}
                mb={-10}
                ph={8}
                pv={4}
                mr={-(cardWidth / 1.6)}
                backgroundColor={active ? lightGreen : lightOrange}
                borderRadius={6}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    color={WHITE}
                    size={9}
                    bold
                    caps
                >
                    {active ? 'Active' : 'Inactive'}
                </TemplateText>
            </TemplateBox>
        )}
        <TemplateBox pAll={20} onPress={onPress} selfCenter alignItems="center">
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
                <TemplateText color={WHITE} bold size={12}>
                    {buttonTitle}
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 40,
        alignSelf: 'center',
    },
    text: {

    },
});

export default BrandsCard;
