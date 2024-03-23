import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    BLACK, WHITE, BRAND_BLUE, TRANSPARENT, WHITE_30, BLACK_60
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateIcon from '../../../../components/TemplateIcon';

interface Props {
    image?: string | number;
    title?: string;
    shortDescription?: string;
    subtitle?: string;
    style?: any;
    cardWidth?: number;
    aspectRatio?: number;
    slideInDelay?: number;
    showGradient?: boolean;
    showVideoButton?: boolean;
    onPress?: () => void;
    icon?: string;
}

const FeedCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    cardWidth = SCREEN_WIDTH / 1.6,
    aspectRatio = 1.5,
    slideInDelay,
    showGradient = true,
    subtitle,
    showVideoButton,
    onPress,
    icon
}) => (
    <TemplateBox
        fullGradient={showGradient}
        alignItems="center"
        justifyContent="center"
        gradientColors={[BLACK_60, BLACK_60]}
        borderRadius={20}
        width={cardWidth}
        aspectRatio={aspectRatio}
        style={style}
        slideInDelay={slideInDelay}
        backgroundColor={!image ? BRAND_BLUE : TRANSPARENT}
    >

        {image && <BackgroundImage source={image} style={styles.image} width={SCREEN_WIDTH} />}

        <TemplateBox pAll={20} onPress={onPress}>
            <TemplateBox row alignItems="center" justifyContent="space-between">
                {/* @ts-ignore */}
                {!!title && (
                    <TemplateText color={WHITE} bold size={18} style={styles.text}>
                        {title}
                    </TemplateText>
                )}
                <TemplateBox flex />
                {icon && (
                    <TemplateBox
                        height={30}
                        width={30}
                        borderRadius={10}
                        backgroundColor={WHITE_30}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TemplateIcon name={icon || 'rocket-outline'} size={20} color={BLACK} />
                    </TemplateBox>
                )}
            </TemplateBox>
            {!!subtitle && (
                // @ts-ignore
                <TemplateText color={WHITE} italic size={10} style={styles.subtitle}>
                    {subtitle}
                </TemplateText>
            )}
            {/* @ts-ignore */}
            {shortDescription && (
                <TemplateText color={WHITE} size={14} style={styles.text} numberOfLines={2}>
                    {shortDescription}
                </TemplateText>
            )}
        </TemplateBox>
    </TemplateBox>
);

const styles = StyleSheet.create({
    image: {
        borderRadius: 20,
        zIndex: -1,
    },
    text: {
        marginBottom: 5,
    },
    subtitle: {
        marginBottom: 20,
    }
});

export default FeedCard;
