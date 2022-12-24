import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import TemplateIcon from '../TemplateIcon';
import {BLACK} from '../../theme/Colors';

const TabButton = ({focused, icon}) => (
  <View style={[styles.container, focused && styles.activeContainer]}>
    <TemplateIcon name={icon} style={styles.icon} size={22} color={BLACK} />
  </View>
);

TabButton.propTypes = {
  focused: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    opacity: 0.3,
    marginTop: 8,
    width: '100%',
    flex: 1,
  },
  activeContainer: {
    opacity: 1,
  },
  icon: {
    height: 26,
    textAlign: 'center',
  },
});

export default TabButton;
