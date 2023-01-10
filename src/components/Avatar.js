import React from 'react';
import PropTypes from 'prop-types';
import TemplateTouchable from './TemplateTouchable';
import {Image, StyleSheet} from 'react-native';
import defaultAvatar from '../../asssets/images/avatar.jpg';

const Avatar = ({image, onPress, style}) => {
  return (
    <TemplateTouchable style={[styles.container, style]} onPress={onPress}>
      <Image style={styles.image} source={image || defaultAvatar} />
    </TemplateTouchable>
  );
};

Avatar.propTypes = {
  image: PropTypes.any,
  onPress: PropTypes.func,
  style: PropTypes.object,
};
Avatar.defaultProps = {
  image: defaultAvatar,
  onPress: () => {},
  style: {},
};
const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
export default Avatar;
