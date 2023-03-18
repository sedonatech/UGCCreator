import React, { FC } from 'react';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateIcon from '../../../../components/TemplateIcon';
import {
    BLACK, BLACK_40, BRAND_BLUE, GREY_SECONDARY
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';

interface DescriptionRowProps {
    icon?: string
    title: string
}
const DescriptionRow: FC<DescriptionRowProps> = ({
    icon = 'checkmark-done-outline',
    title,
}) => (
    <TemplateBox row alignItems="center">
        <TemplateIcon name={icon} size={24} color={BRAND_BLUE} />
        <TemplateBox width={10} />
        <TemplateText color={BLACK} size={16}>
            {title}
        </TemplateText>
    </TemplateBox>
);

export default DescriptionRow;
