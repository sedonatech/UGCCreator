import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH } from '../theme/Layout';

const BackgroundImage = ({
    style, source, width, ...rest
}) => (
    <FastImage
        style={[styles.image, style]}
        {...rest}
        source={source}
        width={width}
    />
);

BackgroundImage.propTypes = {
    style: PropTypes.shape({}),
    source: PropTypes.shape({}) || PropTypes.number,
    width: PropTypes.number,
};

BackgroundImage.defaultProps = {
    style: null,
    width: SCREEN_WIDTH,
    source: null,
};

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
});

export default BackgroundImage;
