import React from 'react';
import { SlideAreaChart } from '@connectedcars/react-native-slide-charts';
import TemplateBox from '../../../../components/TemplateBox';
import { SHADOW } from '../../../../theme/Shadow';
import { BRAND_BLUE, WHITE } from '../../../../theme/Colors';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';

import TemplateText from '../../../../components/TemplateText';

const BrandStatsGraph = () => (
    <TemplateBox mv={WRAPPER_MARGIN}>
        <TemplateBox mb={10} ml={WRAPPER_MARGIN}>
            <TemplateText bold size={18}>
                Average Monthly Spending
            </TemplateText>
        </TemplateBox>

        <SlideAreaChart
            data={[
                { x: 1, y: 5 },
                { x: 2, y: 6 },
                { x: 3, y: 11 },
                { x: 4, y: 50 },
                { x: 5, y: 3 },
                { x: 6, y: 34 },
                { x: 7, y: 5 },
                { x: 8, y: 6 },
                { x: 9, y: 11 },
            ]}
            scrollable
            shouldCancelWhenOutside={false}
            yAxisProps={{
                verticalLineWidth: 1,
                axisLabel: 'Months',
                numberOfTicks: 2,
                hideMarkers: false,
            }}
            xAxisProps={{
                axisLabel: 'Amount',
            }}
            toolTipProps={{
                toolTipTextRenderers: [
                    ({ scaleY, y }) => ({
                        text: scaleY
                            .invert(y)
                            .toFixed(1)
                            .toString(),
                    }),
                ],
            }}
            axisWidth={1}
            style={{
                borderRadius: 10,
                alignSelf: 'center',
            }}
            height={240}
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
        />

    </TemplateBox>
);

export default BrandStatsGraph;
