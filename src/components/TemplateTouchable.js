import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import createHapticFeedback from '../Utils/CreateHapticFeedback';

const TemplateTouchable = ({
    children,
    onPress,
    activeOpacity,
    disabled,
    ...restProps
}) => {
    const onPressWithHaptic = (...values) => {
        createHapticFeedback();
        if (onPress) {
            onPress(...values);
        }
    };
    return (
        <TouchableOpacity
            disabled={disabled}
            {...restProps}
            onPress={onPressWithHaptic}
            activeOpacity={disabled ? 0.6 : activeOpacity}
        >
            {children}
        </TouchableOpacity>
    );
};

TemplateTouchable.propTypes = {
    children: PropTypes.node.isRequired,
    onPress: PropTypes.func,
    activeOpacity: PropTypes.number,
    disabled: PropTypes.bool,
};

TemplateTouchable.defaultProps = {
    restProps: null,
    onPress: null,
    activeOpacity: 0.8,
    disabled: false,
};

export default TemplateTouchable;
