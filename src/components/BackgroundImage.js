import React from 'react';
import { Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH } from '../theme/Layout';

const BackgroundImage = ({
    style, source, width, ...rest
}) => (
    <Image
        style={[styles.image, style]}
        {...rest}
        source={source}
        width={width}
    />
);

BackgroundImage.propTypes = {
    style: PropTypes.object,
    source: PropTypes.number || PropTypes.object,
    width: PropTypes.number,
};

BackgroundImage.defaultProps = {
    style: PropTypes.object,
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
