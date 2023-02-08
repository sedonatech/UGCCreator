import React, { useRef, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Autocomplete from 'react-native-autocomplete-input';
import {
    BLACK, BLACK_SECONDARY, PRIMARY, WHITE,
} from '../theme/Colors';

const TemplateTextInput = ({
    focus,
    children,
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

    const Component = autoComplete ? Autocomplete : TextInput;
    const autoCompleteProps = autoComplete
        ? {
            containerStyle: {
                width: '100%',
            },
            inputContainerStyle: {
                padding: 10,
            },
            listContainerStyle: {
                border: 0,
            },
        }
        : {};

    return (
        <Component
            {...restProps}
            ref={ref}
            selectionColor={BLACK}
            placeholderTextColor={placeholderTextColor || BLACK_SECONDARY}
            value={value}
            editable={!disabled}
            style={[
                styles.default,
                restProps.style && restProps.style,
                !value && placeholderStyle,
                style,
            ]}
            {...autoCompleteProps}
        />
    );
};

const styles = StyleSheet.create({
    default: {
        backgroundColor: WHITE,
        color: BLACK,
        fontSize: 15,
        paddingHorizontal: 0, // Needed for android
    },
});

TemplateTextInput.propTypes = {
    children: PropTypes.node,
    focus: PropTypes.bool,
    placeholderTextColor: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

TemplateTextInput.defaultProps = {
    children: null,
    focus: false,
    placeholderTextColor: null,
    disabled: false,
    style: null,
};

export default TemplateTextInput;
