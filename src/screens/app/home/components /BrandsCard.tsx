import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';

import { RADIUS_SMALL, SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    BLACK, WHITE, BRAND_BLUE, TRANSPARENT, DEFAULT_GRADIENT, lightGreen, lightOrange,
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import TemplateBox from '../../../../components/TemplateBox';
import { wp } from '../../../../Utils/getResponsiveSize';

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
    lastLoginTime?: string;
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
    buttonTitle = 'View brand details',
    lastLoginTime
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
                <BackgroundImage source={image} style={styles.image} width={SCREEN_WIDTH} />
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
        {lastLoginTime && (
            <TemplateBox
                ph={8}
                pv={4}
                backgroundColor={lightGreen}
                borderRadius={6}
                alignItems="center"
                justifyContent="center"
                height={wp(20)}
                width={wp(110)}
                absolute
                top={wp(12)}
                left={wp(12)}
            >
                <TemplateText
                    color={WHITE}
                    size={9}
                    bold
                >
                    { `Active ${lastLoginTime}` }
                </TemplateText>
            </TemplateBox>
        )}
        <TemplateBox pAll={20} onPress={onPress} selfCenter alignItems="center">
            {/* @ts-ignore */}
            <TemplateText
                color={WHITE}
                bold
                size={titleSize}
                style={styles.text}
                numberOfLines={1}
                adjustsFontSizeToFit
                allowFontScaling
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
                adjustsFontSizeToFit
                allowFontScaling
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
        position: 'absolute',
        bottom: -26,
    },
    text: {

    },
});

export default memo(BrandsCard);
