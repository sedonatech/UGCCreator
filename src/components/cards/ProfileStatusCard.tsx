import React, { FC, memo } from 'react';
import * as Progress from 'react-native-progress';

import { StyleSheet } from 'react-native';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';
import { RADIUS_MEDIUM, SCREEN_WIDTH } from '../../theme/Layout';
import { BLACK, BLACK_30, BRAND_BLUE } from '../../theme/Colors';
import { SHADOW } from '../../theme/Shadow';
import TemplateIcon from '../TemplateIcon';
import { wp } from '../../Utils/getResponsiveSize';

interface ProfileStatusCardProps {
    progress: number;
    title: string;
    description: string;
    style?: any;
    onPress?: () => void;
    showProgress?: boolean;
    slideInDelay?: number;
    showIcon?: boolean;
    icon?: string;
    descriptionLines?: number;
    backgroundColor?: string;
    titleSize?: number;
}
// @ts-ignore
const ProfileStatusCard: FC<ProfileStatusCardProps> = ({
    progress,
    title,
    description,
    style,
    onPress,
    showProgress = true,
    slideInDelay,
    showIcon = true,
    icon,
    descriptionLines,
    backgroundColor = BRAND_BLUE,
    titleSize,
}) => (
    <TemplateBox
        width={SCREEN_WIDTH - 40}
        pAll={20}
        backgroundColor={backgroundColor}
        borderRadius={RADIUS_MEDIUM}
        row
        alignItems="center"
        selfCenter
        style={style}
        onPress={onPress}
        slideIn
        slideInDelay={slideInDelay}
    >
        {showIcon && (
            <TemplateIcon
                name={icon || 'open-outline'}
                color={BLACK}
                size={18}
                style={styles.icon}
            />
        )}
        {showProgress && (
            <TemplateBox mr={10}>
                <Progress.Circle
                    size={50}
                    progress={progress}
                    color={BLACK}
                    unfilledColor={BLACK_30}
                    borderWidth={0}
                    showsText
                    formatText={() => `${Math.round(progress * 100)}%`}
                    thickness={4}
                    allowFontScaling
                    animated
                />
            </TemplateBox>
        )}

        <TemplateBox
            flex
            onPress={onPress}
        >
            <TemplateText
                bold
                color={BLACK}
                size={titleSize || wp(16)}
                // @ts-ignore
                style={styles.title}
            >
                {title}
            </TemplateText>
            <TemplateText
                color={BLACK}
                size={14}
                numberOfLines={descriptionLines}
            >
                {description}
            </TemplateText>
        </TemplateBox>
    </TemplateBox>
);

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        marginBottom: 5,
    }
});

export default memo(ProfileStatusCard);
