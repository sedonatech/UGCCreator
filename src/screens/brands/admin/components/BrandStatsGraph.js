import React from 'react';
import { SlideAreaChart } from '@connectedcars/react-native-slide-charts';
import TemplateBox from '../../../../components/TemplateBox';
import { SHADOW } from '../../../../theme/Shadow';
import { BRAND_BLUE } from '../../../../theme/Colors';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';

import TemplateText from '../../../../components/TemplateText';

const BrandStatsGraph = () => (
    <TemplateBox mv={WRAPPER_MARGIN}>
        <TemplateBox mb={10} ml={WRAPPER_MARGIN}>
            <TemplateText bold size={18}>
                Average Monthly Spending
            </TemplateText>
        </TemplateBox>
        <TemplateBox
            style={SHADOW('default', `${BRAND_BLUE}30`)}
            selfCenter
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
            height={256}
            borderRadius={10}
            overflow="hidden"
            pAll={WRAPPER_MARGIN}
            alignItems="center"
            justifyContent="center"
        >
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
                    { x: 10, y: 50 },
                    { x: 11, y: 3 },
                    { x: 12, y: 34 },
                    { x: 27, y: 11 },
                ]}
                scrollable
                shouldCancelWhenOutside={false}
                yAxisProps={{
                    verticalLineWidth: 1,
                    axisLabel: 'Y Units',
                    axisLabelAlignment: 'middle',
                    rotateAxisLabel: true,
                    numberOfTicks: 2,
                    hideMarkers: true,
                }}
                xAxisProps={{
                    axisLabel: 'X Units',
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
                axisWidth={0}
                axisColor="transparent"
                style={{
                    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2 - 20,

                }}
                height={256}
            />
        </TemplateBox>
    </TemplateBox>
);

export default BrandStatsGraph;
