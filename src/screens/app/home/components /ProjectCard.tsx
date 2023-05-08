import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {
    SCREEN_WIDTH,
    SPACE_XLARGE
} from '../../../../theme/Layout';
import {
    BLACK, BLACK_60, BLACK_90, GREEN, WHITE, YELLOW,
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateBox from '../../../../components/TemplateBox';
import { wp } from '../../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../../components/TemplateIcon';
import TemplateTouchable from '../../../../components/TemplateTouchable';

interface Props {
    image?: string | number | any;
    title?: string;
    shortDescription?: string;
    style?: any;

    slideInDelay?: number;

    onPress?: () => void;

    enrolled?: boolean;

    duration?: string;

    projectType?: string;
}

const CARD_WIDTH = (SCREEN_WIDTH / 2) - 28;
const ProjectCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    slideInDelay,
    onPress,
    enrolled,
    duration,
    projectType
}) => (
    <TemplateTouchable
        style={[styles.container, style]}
        onPress={onPress}
    >
        {enrolled && (
            <TemplateBox
                flex
                absolute
                borderRadius={10}
                backgroundColor={GREEN}
                height={25}
                width={CARD_WIDTH / 2.6}
                alignItems="center"
                justifyContent="center"
                top={140}
                left={88}
            >
                <TemplateText bold size={8} color={WHITE}>Enrolled</TemplateText>
            </TemplateBox>
        )}

        <TemplateBox
            flex
            absolute
            borderRadius={8}
            backgroundColor={YELLOW}
            height={26}
            width={CARD_WIDTH / 2.6}
            alignItems="center"
            justifyContent="center"
            top={16}
            left={16}
            zIndex={2}
        >
            <TemplateText size={10} color={BLACK} caps semiBold>New</TemplateText>
        </TemplateBox>

        <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
            style={styles.linearGradient}
        />
        <Image style={styles.image} source={image} />
        <TemplateBox width={CARD_WIDTH - 8} selfCenter top={110} left={16}>
            {/* @ts-ignore */}
            <TemplateText color={WHITE} bold size={16} caps style={styles.text}>
                {title}
            </TemplateText>
            <TemplateBox row alignItems="center">
                <TemplateIcon
                    name="trending-up-outline"
                    color={WHITE}
                    size={14}
                    style={styles.icon}
                />
                <TemplateText color={WHITE} size={12}>
                    {projectType}
                </TemplateText>
            </TemplateBox>
            <TemplateBox row alignItems="center">
                <TemplateIcon
                    name="calendar-outline"
                    color={WHITE}
                    size={14}
                    style={styles.icon}
                />
                <TemplateText color={WHITE} size={12}>
                    {duration}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>

    </TemplateTouchable>
);

const styles = StyleSheet.create({
    text: {
        marginTop: 40,
        width: 140
    },
    container: {
        width: CARD_WIDTH,
        height: 240,
        borderRadius: 16,
    },
    linearGradient: {
        position: 'absolute',
        width: CARD_WIDTH,
        height: 240,
        borderRadius: 16,
    },
    image: {
        width: CARD_WIDTH,
        height: 240,
        borderRadius: 16,
        position: 'absolute',
        resizeMode: 'cover',
        zIndex: -1,
    },
    icon: {
        marginRight: 5
    }
});

export default ProjectCard;
