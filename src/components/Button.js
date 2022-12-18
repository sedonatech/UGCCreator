import React from 'react';
import PropTypes from 'prop-types';
import TemplateTouchable from './TemplateTouchable';
import {BLACK, PRIMARY} from '../theme/Colors';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import {RADIUS_SMALL, SCREEN_WIDTH} from '../theme/Layout';
import TemplateText from './TemplateText';

const Button = ({
  height,
  width,
  color,
  onPress,
  title,
  loading,
  disabled,
  style,
                  titleColor
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
          height: height,
          width: width,
          backgroundColor: color,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={BLACK} />
      ) : (
        <TemplateText subTitle semiBold center color={titleColor}>
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
  style: PropTypes.object,
  titleColor: PropTypes.string,
};
Button.defaultProps = {
  height: 60,
  width: SCREEN_WIDTH - 32,
  color: PRIMARY,
  onPress: () => {},
  title: 'Button',
  loading: false,
  disabled: false,
  style: {},
  titleColor: BLACK,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
export default Button;
