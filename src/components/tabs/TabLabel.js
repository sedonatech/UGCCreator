import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {BLACK} from '../../theme/Colors';
import TemplateText from '../TemplateText';

const TabLabel = ({focused, children}) => (
  <TemplateText black style={[styles.label, focused && styles.activeLabel]}>
    {children}
  </TemplateText>
);

TabLabel.propTypes = {
  children: PropTypes.node.isRequired,
  focused: PropTypes.bool,
};

TabLabel.defaultProps = {
  focused: false,
};

const styles = StyleSheet.create({
  label: {
    color: BLACK,
    fontSize: 10,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
  activeLabel: {
    opacity: 1,
  },
});

export default TabLabel;
