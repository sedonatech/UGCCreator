import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import {
    BLACK, BLACK_30, ERROR_RED, GREY_SECONDARY,
} from '../../../../theme/Colors';
import TemplateIcon from '../../../../components/TemplateIcon';

const SettingsRow = ({
    title, icon, subtitle, onPress,
}) => {
    const isLast = title === 'Logout';

    return (
        <TemplateBox>
            <TemplateBox
                row
                alignItems="center"
                onPress={onPress}
            >
                <TemplateIcon name={icon} size={24} color={isLast ? ERROR_RED : BLACK} />
                <TemplateBox width={WRAPPER_MARGIN} />
                <TemplateBox>
                    <TemplateText
                        bold
                        color={isLast ? ERROR_RED : BLACK}
                        size={18}
                        lineHeight={24}
                    >
                        {title}
                    </TemplateText>
                    {!isLast && (
                        <TemplateText color={BLACK_30} size={12}>{subtitle}</TemplateText>
                    )}
                </TemplateBox>
                <TemplateBox flex />
                {!isLast && (
                    <TemplateIcon name="chevron-forward-outline" size={24} color={BLACK} />
                )}
            </TemplateBox>
            {!isLast && (
                <TemplateBox
                    height={1}
                    width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
                    backgroundColor={GREY_SECONDARY}
                    mb={WRAPPER_MARGIN}
                    mt={10}
                    selfCenter
                />

            )}
        </TemplateBox>
    );
};

SettingsRow.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    subtitle: PropTypes.string,
    onPress: PropTypes.func,
};

SettingsRow.defaultProps = {
    title: '',
    icon: '',
    subtitle: '',
    onPress: () => {},
};
export default SettingsRow;
