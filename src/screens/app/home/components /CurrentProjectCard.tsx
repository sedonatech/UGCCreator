import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

import TemplateBox from '../../../../components/TemplateBox';
import {
    BLACK, BLACK_20, BRAND_BLUE, GREY, PINK, WHITE_30
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import {
    RADIUS_MEDIUM, RADIUS_SMALL, RADIUS_XSMALL, SCREEN_WIDTH
} from '../../../../theme/Layout';
import TemplateIcon from '../../../../components/TemplateIcon';
import AvatarOverlaps from '../../../../components/AvatarOverlaps';
import { DEFAULT_AVATARS } from '../../../../consts/content/Home';

interface Props {
    title?: string;
    brand?: string;
    progress?: number;
    status?: string;
    notificationCount?: number;

    documentCount?: number;

    daysLeft?: number;
    onPress?: () => void;

    style?: any;
    cardColor?: string;

    tagColor?: string;

    width?: number;

    slideInDelay?: number;
    isBrand?: boolean;

}

const CurrentProjectCard: FC<Props> = ({
    title,
    brand,
    progress,
    status,
    notificationCount,
    documentCount,
    daysLeft,
    onPress,
    style,
    cardColor,
    tagColor,
    width,
    slideInDelay,
    isBrand = false,
}) => {
    const color = status === 'High' ? PINK : BRAND_BLUE;

    return (
        <TemplateBox
            width={width || (SCREEN_WIDTH / 1.23)}
            borderRadius={RADIUS_MEDIUM}
            shadow
            pAll={20}
            backgroundColor={cardColor || color}
            style={style}
            onPress={onPress}
            slideIn={slideInDelay !== undefined}
            slideInDelay={slideInDelay}
        >

            <TemplateBox row alignItems="center" mb={20}>
                <TemplateBox
                    borderRadius={8}
                    backgroundColor={tagColor || WHITE_30}
                    alignItems="center"
                    justifyContent="center"
                    ph={10}
                    pv={5}

                >
                    <TemplateText size={12} color={BLACK} medium>{status}</TemplateText>
                </TemplateBox>
                <TemplateBox flex />
                {/* <TemplateIcon color={BLACK} size={24} name="bookmark-outline" /> */}
                <TemplateIcon color={BLACK} size={24} name="ellipsis-vertical-outline" />
            </TemplateBox>
            {/* @ts-ignore */}
            <TemplateText size={18} bold color={BLACK} style={styles.title}>
                {title}
            </TemplateText>

            {!!progress && (
                <TemplateBox
                    mb={16}
                >
                    <TemplateText size={12} color={GREY}>
                        Progress
                    </TemplateText>
                    <TemplateBox
                        row
                        alignItems="center"
                        mt={5}
                    >
                        <Progress.Bar
                            progress={progress}
                            width={SCREEN_WIDTH / 1.6}
                            height={4}
                            color={BLACK}
                            unfilledColor={BLACK_20}
                            style={styles.progress}
                            borderWidth={0}
                        />
                        <TemplateText size={12} color={BLACK}>
                            {`${progress * 100}%`}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            )}

            <TemplateBox row alignItems="center">
                {isBrand ? (
                    <AvatarOverlaps imageUrls={DEFAULT_AVATARS} />
                ) : (
                    <TemplateText size={14} color={BLACK} bold>
                        {brand}
                    </TemplateText>
                )}
                <TemplateBox flex />

                <TemplateBox row alignItems="center">
                    <TemplateIcon color={BLACK} size={18} name="document-outline" />
                    <TemplateText size={12} color={BLACK}>
                        {documentCount!}
                        {'  '}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox row alignItems="center">
                    <TemplateIcon color={BLACK} size={18} name="chatbubble-ellipses-outline" />
                    <TemplateText size={12} color={BLACK}>
                        {notificationCount!}
                        {'  '}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox row alignItems="center">
                    <TemplateIcon color={BLACK} size={18} name="time-outline" />
                    <TemplateText size={12} color={BLACK}>
                        {`${daysLeft} days`}
                        {'  '}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    progress: {
        marginRight: 10,
    },
    title: {
        marginBottom: 10,
    }
});

export default CurrentProjectCard;
