import React from 'react';
import {Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {startCase as startCaseFunc} from 'lodash';
import {isShortDEvice} from '../theme/Layout';
import {BLACK, BLACK_SECONDARY, PRIMARY, WHITE} from '../theme/Colors';
import {isAndroid} from '../Utils/Platform';

const TemplateText = ({
  light,
  medium,
  bold,
  black,
  white,
  title,
  caps,
  subTitle,
  underLine,
  small,
  green,
  semiBold,
  center,
  left,
  right,
  color,
  size,
  lineThrough,
  children,
  numberOfLines,
  startCase,
  ...restProps
}) => {
  const textStyle = {};

  if (light) {
    textStyle.fontWeight = '300';
  }

  if (medium) {
    textStyle.fontWeight = '500';
  }

  if (bold) {
    textStyle.fontWeight = '700';
  }
  if (semiBold) {
    textStyle.fontWeight = '600';
  }

  if (black) {
    textStyle.color = BLACK;
  }

  if (white) {
    textStyle.color = WHITE;
  }

  if (title) {
    textStyle.fontSize = 29;
  }

  if (caps) {
    textStyle.textTransform = 'uppercase';
  }
  if (subTitle) {
    textStyle.fontSize = 20;
  }
  if (underLine) {
    textStyle.textDecorationLine = 'underline';
  }

  if (small) {
    textStyle.fontSize = 14;
  }

  if (green) {
    textStyle.color = PRIMARY;
  }

  if (left) {
    textStyle.textAlign = 'left';
  }
  if (right) {
    textStyle.textAlign = 'right';
  }

  if (center) {
    textStyle.textAlign = 'center';
  }

  if (color) {
    textStyle.color = color;
  }

  if (size) {
    textStyle.fontSize = size;
  }

  if (lineThrough) {
    textStyle.textDecorationLine = 'line-through';
    textStyle.textDecorationStyle = 'solid';
  }

  let content = children;

  if (startCase) {
    content = startCaseFunc(children);
  }

  return (
    <Text
      {...restProps}
      style={[styles.default, restProps.style && restProps.style, textStyle]}
      numberOfLines={numberOfLines}
      allowFontScaling={
        numberOfLines === 1 ? true : restProps?.allowFontScaling
      }
      adjustsFontSizeToFit={
        numberOfLines === 1 ? true : restProps?.adjustsFontSizeToFit
      }>
      {content}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: isAndroid ? 'Roboto' : 'Arial',
    fontSize: isShortDEvice ? 15 : 18,
    color: BLACK_SECONDARY,
  },
});

TemplateText.propTypes = {
  light: PropTypes.bool,
  medium: PropTypes.bool,
  bold: PropTypes.bool,
  black: PropTypes.bool,
  white: PropTypes.bool,
  title: PropTypes.bool,
  caps: PropTypes.bool,
  subTitle: PropTypes.bool,
  underLine: PropTypes.bool,
  small: PropTypes.bool,
  green: PropTypes.bool,
  semiBold: PropTypes.bool,
  center: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.number,
  lineThrough: PropTypes.bool,
  children: PropTypes.node,
  numberOfLines: PropTypes.number,
  startCase: PropTypes.bool,
};

TemplateText.defaultProps = {
  light: false,
  medium: false,
  bold: false,
  black: false,
  white: false,
  title: false,
  caps: false,
  subTitle: false,
  underLine: false,
  small: false,
  green: false,
  semiBold: false,
  center: false,
  left: false,
  right: false,
  color: null,
  size: null,
  lineThrough: false,
  children: null,
  numberOfLines: null,
  startCase: false,
};

export default TemplateText;
