import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';

import TemplateBox from '../../../../components/TemplateBox';
import {
    BLACK, BLACK_20, BRAND_BLUE, GREY, PINK, WHITE_20, WHITE_30
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import { RADIUS_MEDIUM, RADIUS_SMALL, SCREEN_WIDTH } from '../../../../theme/Layout';
import TemplateIcon from '../../../../components/TemplateIcon';

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
}) => {
    const color = status === 'High' ? PINK : BRAND_BLUE;

    return (
        <TemplateBox
            width={SCREEN_WIDTH / 1.23}
            borderRadius={RADIUS_MEDIUM}
            shadow
            pAll={20}
            backgroundColor={color}
            style={style}
            onPress={onPress}
        >

            <TemplateBox row alignItems="center" mb={20}>
                <TemplateBox
                    borderRadius={RADIUS_SMALL}
                    backgroundColor={WHITE_30}
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

            <TemplateText size={18} bold color={BLACK}>
                {title}
            </TemplateText>

            {progress && (
                <TemplateBox
                    mt={10}
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
                <TemplateText size={14} color={BLACK} bold>
                    {brand}
                </TemplateText>
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
    }
});

export default CurrentProjectCard;
