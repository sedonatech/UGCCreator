import React, { FC } from 'react';
import { Image, StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLACK_30,
    BLACK_40,
    BLACK_60,
    GREY,
    GREEN,
    WHITE,
    YELLOW,
    BLACK_80,
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateIcon from '../../../../components/TemplateIcon';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import useTranslation from '../../../../hooks/useTranslation';

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
    isShowcase?: boolean;
    width?: number;
    height?: number;
}

const CARD_WIDTH = SCREEN_WIDTH / 1.3 - 28;
const IMAGE_HEIGHT = 180;

const UGCProjectsCard: FC<Props> = ({
    image,
    style,
    shortDescription,
    title,
    onPress,
    enrolled,
    duration,
    projectType,
    isShowcase,
    width = CARD_WIDTH,
    height = IMAGE_HEIGHT,
}) => {
    const { t } = useTranslation() as { t: (key: string) => string };
    return (
        <TemplateTouchable
            style={[styles.container, { width: width }, style]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={!onPress}
        >
            <TemplateBox style={styles.imageWrapper}>
                {!!image && <Image style={[styles.image, { height: height }]} source={image} />}
            </TemplateBox>

            <TemplateBox style={styles.content}>
                <TemplateText color={BLACK} medium size={16} style={styles.title} numberOfLines={2}>
                    {title}
                </TemplateText>
                {!!shortDescription && (
                    <TemplateText color={BLACK_80} size={14} style={styles.subtitle} numberOfLines={2}>
                        {shortDescription}
                    </TemplateText>
                )}

                {!!projectType && (
                    <TemplateBox row alignItems="center" style={styles.metaRow}>
                        <TemplateIcon name="pricetag" color={BLACK_60} size={12} style={styles.icon} />
                        <TemplateText color={BLACK_80} size={12} semiBold>
                            {projectType}
                        </TemplateText>
                    </TemplateBox>
                )}
                {!!duration && (
                    <TemplateBox row alignItems="center" style={styles.metaRow}>
                        <TemplateIcon name="time" color={BLACK_60} size={12} style={styles.icon} />
                        <TemplateText color={BLACK_80} size={12} semiBold>
                            {duration}
                        </TemplateText>
                    </TemplateBox>
                )}

                <TemplateBox style={styles.actionRow}>
                    <TemplateBox style={styles.button}>
                        <TemplateText color={WHITE} size={14} semiBold>
                            {t('explore.projectDetails.buttons.viewProject')}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
        </TemplateTouchable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        backgroundColor: WHITE,
        borderWidth: 0.6,
        borderColor: BLACK_20,
        overflow: 'hidden',
    },
    imageWrapper: {
        width: '100%',
        height: IMAGE_HEIGHT + 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 12,
        backgroundColor: WHITE,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 14,
        borderTopWidth: 0,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        backgroundColor: WHITE,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        marginBottom: 10,
    },
    metaRow: {
        marginBottom: 6,
    },
    icon: {
        marginRight: 6,
    },
    actionRow: {
        marginTop: 10,
    },
    button: {
        backgroundColor: BLACK,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default UGCProjectsCard;
