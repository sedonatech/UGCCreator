import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import TemplateText from './TemplateText';
import {BLUE} from '../theme/Colors';
import {SCREEN_HEIGHT} from '../theme/Layout';

const Loading = ({color, size, style, text, textStyle}) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator size={size} color={color} />
    {!!text && (
      <TemplateText style={[styles.text, textStyle]}>{text}</TemplateText>
    )}
  </View>
);

Loading.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string,
  textStyle: PropTypes.object,
};
Loading.defaultProps = {
  color: BLUE,
  size: 'large',
  style: {},
  text: '',
  textStyle: {},
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2,
    alignSelf: 'center',
  },
  text: {
    marginTop: 15,
  },
});

export default Loading;
