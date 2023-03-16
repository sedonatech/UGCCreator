import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import {
    SPACE_XLARGE
} from '../../../../theme/Layout';
import {
    BLACK, BLACK_90, GREEN, WHITE
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateBox from '../../../../components/TemplateBox';

interface Props {
    image?: string | number | any;
    title?: string;
    shortDescription?: string;
    style?: any;

    slideInDelay?: number;

    onPress?: () => void;

    enrolled?: boolean;
}

const CARD_WIDTH = 150;
const ProjectCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    slideInDelay,
    onPress,
    enrolled
}) => (
    <TemplateBox
        mb={SPACE_XLARGE}
        style={style}
        slideIn={slideInDelay !== undefined}
        slideInDelay={slideInDelay}
        width={CARD_WIDTH}
    >
        <TemplateBox
            width={CARD_WIDTH}
            aspectRatio={1.12}
            onPress={onPress}
        >
            <BackgroundImage source={image} style={styles.image} width={CARD_WIDTH} />
            {enrolled && (
                <TemplateBox
                    flex
                    absolute
                    borderRadius={10}
                    backgroundColor={GREEN}
                    height={30}
                    width={CARD_WIDTH / 2}
                    alignItems="center"
                    justifyContent="center"
                    top={94}
                    left={64}
                >
                    <TemplateText bold size={11} color={WHITE}>Enrolled</TemplateText>
                </TemplateBox>
            )}
        </TemplateBox>
        <TemplateBox width={CARD_WIDTH - 8} selfCenter>
            {/* @ts-ignore */}
            <TemplateText color={BLACK} bold size={14} style={styles.text}>
                {title}
            </TemplateText>
            {/* @ts-ignore */}
            <TemplateText color={BLACK_90} size={12} style={styles.text} numberOfLines={2}>
                {shortDescription}
            </TemplateText>
        </TemplateBox>
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
