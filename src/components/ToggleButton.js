import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from './TemplateBox';
import {
    RADIUS_SMALL, SPACE_LARGE, SPACE_MEDIUM, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../theme/Layout';
import { BLACK, WHITE } from '../theme/Colors';
import { SHADOW } from '../theme/Shadow';
import TemplateText from './TemplateText';
import TemplateIcon from './TemplateIcon';

const ToggleButton = ({
    title, toggleFilters, setToggleFilters, style,
}) => (
    <TemplateBox
        row
        alignItems="center"
        justifyContent="space-between"
        pAll={WRAPPER_MARGIN}
        width={WRAPPED_SCREEN_WIDTH}
        borderRadius={RADIUS_SMALL}
        backgroundColor={WHITE}
        mb={SPACE_LARGE}
        selfCenter
        onPress={() => setToggleFilters((prevState) => !prevState)}
        style={[SHADOW('default', WHITE), style]}
    >
        <TemplateText color={BLACK} size={18}>{title}</TemplateText>
        <TemplateIcon
            name={toggleFilters
                ? 'chevron-up-outline'
                : 'chevron-down-outline'}
            color={BLACK}
            size={24}
        />
    </TemplateBox>
);

ToggleButton.propTypes = {
    title: PropTypes.string,
    toggleFilters: PropTypes.bool,
    setToggleFilters: PropTypes.func,
    style: PropTypes.shape({}),
};
ToggleButton.defaultProps = {
    title: '',
    toggleFilters: false,
    setToggleFilters: () => {},
    style: {},
};
export default ToggleButton;
