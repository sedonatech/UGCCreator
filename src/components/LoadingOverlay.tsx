import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import TemplateBox from './TemplateBox';
import TemplateText from './TemplateText';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../theme/Layout';
import {
    BLACK, BLACK_40, IOS_BLUE
} from '../theme/Colors';
import { wp } from '../Utils/getResponsiveSize';

interface LoadingOverlayProps {
    message?: string
    ml?: number,
    backgroundColor?: string
}
const LoadingOverlay: FC<LoadingOverlayProps> = ({ message, ml = 0, backgroundColor = BLACK_40 }) => (
    <TemplateBox
        height={SCREEN_HEIGHT}
        width={SCREEN_WIDTH}
        alignItems="center"
        justifyContent="center"
        backgroundColor={backgroundColor}
        absolute
        ml={ml}
        flex
    >
        <ActivityIndicator color={IOS_BLUE} size="large" />
        <TemplateBox height={wp(20)} />
        <TemplateText color={BLACK} size={20} bold center>
            {message}
        </TemplateText>

    </TemplateBox>
);

export default LoadingOverlay;
