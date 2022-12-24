import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {BLACK_50} from '../theme/Colors';
import {SCREEN_WIDTH, WRAPPER_MARGIN} from '../theme/Layout';

const Divider = ({wrap, style}) => (
  <View style={[styles.divider, wrap && styles.wrap, style]} />
);

Divider.propTypes = {
  wrap: PropTypes.bool,
};

Divider.defaultProps = {
  wrap: false,
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: BLACK_50,
    marginVertical: 20,
    height: 1,
    width: '100%',
  },
  wrap: {
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
  },
});

export default Divider;
