import React, { FC } from 'react';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateIcon from '../../../../components/TemplateIcon';
import TemplateText from '../../../../components/TemplateText';
import { BLACK, GREY_SECONDARY } from '../../../../theme/Colors';
import { WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import { wp } from '../../../../Utils/getResponsiveSize';
import DynamicIcon, { DynamicIconName } from '../../../../components/icons/DynamicIcon';

interface DescriptionRangeProps {
    icon: DynamicIconName;
    maxTitle: string;
    maxSubtitle: string;
    minTitle: string;
    minSubtitle: string;
    style?: any;
}

const DescriptionRange: FC<DescriptionRangeProps> = ({ icon, maxTitle, maxSubtitle, minTitle, minSubtitle, style }) => (
    <TemplateBox
        row
        pAll={WRAPPER_MARGIN}
        borderRadius={10}
        borderWidth={1}
        borderColor={GREY_SECONDARY}
        justifyContent="space-between"
        alignItems="center"
        style={style}
        width={wp(WRAPPED_SCREEN_WIDTH)}
    >
        <TemplateBox row alignItems="center">
            <TemplateBox
                backgroundColor={GREY_SECONDARY}
                borderRadius={10}
                justifyContent="center"
                alignItems="center"
                pAll={10}
                mr={10}
            >
                <DynamicIcon name={icon} color={BLACK} size={24} />
            </TemplateBox>
            <TemplateBox>
                <TemplateText color={BLACK} size={14}>
                    {maxSubtitle}
                </TemplateText>
                <TemplateText color={BLACK} size={14} semiBold>
                    {maxTitle}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>

        <TemplateBox row alignItems="center">
            <TemplateBox
                backgroundColor={GREY_SECONDARY}
                borderRadius={10}
                justifyContent="center"
                alignItems="center"
                pAll={10}
                mr={10}
            >
                <DynamicIcon name={icon} color={BLACK} size={24} />
            </TemplateBox>
            <TemplateBox>
                <TemplateText color={BLACK} size={14}>
                    {minSubtitle}
                </TemplateText>

                <TemplateText color={BLACK} size={14} semiBold>
                    {minTitle}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
    </TemplateBox>
);

export default DescriptionRange;
