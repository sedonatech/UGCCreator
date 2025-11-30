/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet } from 'react-native';
import TemplateTouchable from './TemplateTouchable';
import { BLACK, WHITE } from '../theme/Colors';
import { SCREEN_WIDTH } from '../theme/Layout';
import TemplateText from './TemplateText';

const Button = ({
    height,
    width,
    color = BLACK,
    onPress,
    title,
    loading,
    disabled,
    style,
    titleColor = WHITE,
    titleSize = 16,
}) => {
    const handleOnPress = () => {
        if (disabled) {
            return;
        }
        if (loading) {
            return;
        }
        if (onPress) {
            onPress();
        }
    };

    return (
        <TemplateTouchable
            onPress={handleOnPress}
            style={[
                styles.container,
                {
                    height,
                    width,
                    backgroundColor: color,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={WHITE} />
            ) : (
                <TemplateText size={titleSize} subTitle semiBold center color={titleColor}>
                    {title}
                </TemplateText>
            )}
        </TemplateTouchable>
    );
};

Button.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    color: PropTypes.string,
    onPress: PropTypes.func,
    title: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.shape({}),
    titleColor: PropTypes.string,
    titleSize: PropTypes.number,
};
Button.defaultProps = {
    height: 60,
    width: SCREEN_WIDTH - 32,
    color: BLACK,
    onPress: () => {},
    title: 'Button',
    loading: false,
    disabled: false,
    style: {},
    titleColor: WHITE,
    titleSize: 16,
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26,
    },
});
export default Button;
