import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import TemplateBox from '../../../../components/TemplateBox';
import { SHADOW } from '../../../../theme/Shadow';
import { WHITE } from '../../../../theme/Colors';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import { chartConfig, chartData } from '../../../../consts/content/Home';
import TemplateText from '../../../../components/TemplateText';

const BrandStatsGraph = () => (
    <TemplateBox mv={WRAPPER_MARGIN}>
        <TemplateBox mb={10} ml={WRAPPER_MARGIN}>
            <TemplateText bold size={18}>
                Average Monthly Spending
            </TemplateText>
        </TemplateBox>
        <TemplateBox
            style={SHADOW('default', WHITE)}
            selfCenter
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
            height={256}
            borderRadius={10}
            overflow="hidden"

        >
            <LineChart
                data={chartData}
                width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                height={256}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
            />
        </TemplateBox>
    </TemplateBox>
);

export default BrandStatsGraph;
