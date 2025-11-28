import React, { useRef, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, BLACK_SECONDARY, WHITE } from '../theme/Colors';

const TemplateTextInput = ({
    focus,
    disabled,
    placeholderTextColor,
    placeholderStyle,
    value,
    style,
    autoComplete = false,
    ...restProps
}) => {
    // Handle autofocus: create ref to input
    const ref = useRef();

    // Handle autofocus: if focus is true, call focus method
    useEffect(() => {
        if (focus) {
            ref.current.focus();
        }
    }, [focus]);

    return (
        <TextInput
            {...restProps}
            ref={ref}
            selectionColor={BLACK}
            placeholderTextColor={placeholderTextColor || BLACK_SECONDARY}
            value={value}
            editable={!disabled}
            style={[styles.default, restProps.style && restProps.style, !value && placeholderStyle, style]}
        />
    );
};

const styles = StyleSheet.create({
    default: {
        backgroundColor: WHITE,
        color: BLACK,
        fontSize: 17,
        paddingHorizontal: 0, // Needed for android
    },
});

TemplateTextInput.propTypes = {
    focus: PropTypes.bool,
    placeholderTextColor: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    value: PropTypes.string.isRequired,
    placeholderStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    autoComplete: PropTypes.bool,
};

TemplateTextInput.defaultProps = {
    focus: false,
    placeholderTextColor: null,
    disabled: false,
    style: null,
    placeholderStyle: null,
    autoComplete: false,
};

export default TemplateTextInput;
