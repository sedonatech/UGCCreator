import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import {
    BLACK, BLACK_80, ERROR_RED, GREY_SECONDARY,
} from '../../../../theme/Colors';
import TemplateIcon from '../../../../components/TemplateIcon';

const SettingsRow = ({
    title, icon, subtitle, onPress, isLast, isFirst,
}) => {
    const showChevronIcon = !isLast && !isFirst;

    return (
        <TemplateBox onPress={onPress}>
            <TemplateBox
                row
                alignItems="center"
                onPress={onPress}
            >
                {!!icon
                    && (
                        <TemplateIcon
                            name={icon}
                            size={20}
                            color={isLast
                                ? ERROR_RED
                                : BLACK}
                        />
                    )}
                <TemplateBox width={WRAPPER_MARGIN} />
                <TemplateBox width={SCREEN_WIDTH - 100} onPress={onPress}>
                    <TemplateText
                        bold
                        color={isLast ? ERROR_RED : BLACK}
                        size={16}
                        lineHeight={24}
                    >
                        {title}
                    </TemplateText>
                    {!isLast && (
                        <TemplateText color={BLACK_80} size={12}>{subtitle}</TemplateText>
                    )}
                </TemplateBox>
                <TemplateBox flex />
                {showChevronIcon && (
                    <TemplateIcon name="arrow-forward-outline" size={20} color={BLACK} />
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
    isLast: PropTypes.bool,
    isFirst: PropTypes.bool,
};

SettingsRow.defaultProps = {
    title: '',
    icon: '',
    subtitle: '',
    onPress: () => {},
    isLast: false,
    isFirst: false,
};
export default SettingsRow;
