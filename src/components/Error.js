import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import TemplateText from './TemplateText';
import {isShortDEvice, isSmallDevice} from '../theme/Layout';
import {ERROR_RED} from '../theme/Colors';

// imp

const Error = ({show, children, style}) =>
  show && (
    <View
      style={[
        styles.errorContainer,
        style,
        isSmallDevice && !show && styles.hideOnSmallDevice,
      ]}>
      <TemplateText size={12} medium style={styles.error}>
        {children}
      </TemplateText>
    </View>
  );

const styles = StyleSheet.create({
  errorContainer: {
    marginTop: 5,
    marginBottom: isShortDEvice ? 2 : 0,
    width: '100%',
    overflow: isSmallDevice ? 'visible' : 'visible',
  },
  hideOnSmallDevice: {
    height: 0,
  },
  error: {
    color: ERROR_RED,
    lineHeight: isShortDEvice ? 12 : 15,
  },
});

Error.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
};

Error.defaultProps = {
  show: false,
  children: null,
  style: null,
};

export default Error;
