import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import TemplateBox from './TemplateBox';
import TemplateText from './TemplateText';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../theme/Layout';
import {
    BLACK, LAVENDER, WHITE_30
} from '../theme/Colors';
import Blob from '../../assets/svgs/Blob';

interface LoadingOverlayProps {
    message?: string
    ml?: number
}
const LoadingOverlay: FC<LoadingOverlayProps> = ({ message, ml = 0 }) => (
    <TemplateBox
        height={SCREEN_HEIGHT}
        width={SCREEN_WIDTH}
        alignItems="center"
        justifyContent="center"
        backgroundColor={WHITE_30}
        absolute
        ml={ml}

    >
        <TemplateBox>
            {/* @ts-ignore */}
            <Blob top color={LAVENDER} />
            {/* @ts-ignore */}
            <Blob right color={LAVENDER} />
            {/* @ts-ignore */}
            <Blob color={LAVENDER} bottom />
            <Blob center />
        </TemplateBox>
        <TemplateText color={BLACK} size={20} bold center>
            {message}
        </TemplateText>
        <TemplateBox height={40} />
        <ActivityIndicator color={BLACK} size="large" />
    </TemplateBox>
);

export default LoadingOverlay;
