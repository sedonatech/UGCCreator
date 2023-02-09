import React, { FC } from 'react';
import * as Progress from 'react-native-progress';

import { StyleSheet } from 'react-native';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';
import { RADIUS_MEDIUM, SCREEN_WIDTH } from '../../theme/Layout';
import { BLACK, BLACK_30, BRAND_BLUE } from '../../theme/Colors';
import { SHADOW } from '../../theme/Shadow';
import TemplateIcon from '../TemplateIcon';

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
}) => (
    <TemplateBox
        width={SCREEN_WIDTH - 40}
        pAll={20}
        backgroundColor={BRAND_BLUE}
        borderRadius={RADIUS_MEDIUM}
        row
        alignItems="center"
        selfCenter
        style={[style, SHADOW('default', BRAND_BLUE)]}
        onPress={onPress}
        slideIn
        slideInDelay={slideInDelay}
    >

        {showIcon && (
            <TemplateIcon
                name={icon || 'open-outline'}
                color={BLACK}
                size={20}
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
                    thickness={4}
                    allowFontScaling
                    animated
                />
            </TemplateBox>
        )}

        <TemplateBox
            flexWrap="wrap"
            flex
        >
            <TemplateText
                bold
                color={BLACK}
                size={18}
                // @ts-ignore
                style={styles.title}
            >
                {title}
            </TemplateText>
            <TemplateText
                color={BLACK}
                size={14}

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
export default ProfileStatusCard;
