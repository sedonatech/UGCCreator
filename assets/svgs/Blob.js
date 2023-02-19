import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';
import { LAVENDER } from '../../src/theme/Colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../src/theme/Layout';

const Blob = ({
    style, size, color, top, bottom, right, center,
}) => {
    const ratio = 1.0390879478827362;

    let containerStyle;
    if (top) {
        containerStyle = styles.topBlob;
    } else if (bottom) {
        containerStyle = styles.bottomBlob;
    } else if (right) {
        containerStyle = styles.rightBlob;
    } else if (center) {
        containerStyle = styles.centerBlob;
    } else {
        containerStyle = styles.default;
    }

    return (
        <Svg
            width={size}
            height={size / ratio}
            viewBox="0 0 319 307"
            style={containerStyle}
        >
            <G fill="none" fillRule="evenodd" opacity={0.296}>
                <Path
                    d="M254.696 88.316c10.96 16.248 17.074 33.211 18.55 49.825 1.477 16.614-1.684 32.88-9.277 47.73-7.593 14.852-19.617 28.29-35.865 39.25l-26.121 17.618c-16.249 10.96-33.212 17.074-49.826 18.55-16.614 1.477-32.88-1.684-47.73-9.277-14.852-7.593-28.29-19.617-39.249-35.865-10.96-16.248-17.074-33.212-18.55-49.826-1.477-16.614 1.685-32.879 9.277-47.73C63.498 103.74 75.522 90.3 91.77 79.342l26.121-17.619c16.249-10.96 33.212-17.074 49.826-18.55 16.614-1.477 32.88 1.685 47.73 9.278 14.852 7.592 28.29 19.616 39.249 35.865Z"
                    fill={color}
                    opacity={0.7}
                />
                <Path
                    d="M267.828 153.21c3.49 18.364-.024 38.059-11.372 54.732a73.033 73.033 0 0 1-40.159 29.09l-.689.195c-28.824 8-62.985 9.533-102.48 4.631-25.034-3.106-46.438-16.066-60.807-34.507-14.37-18.441-21.704-42.364-18.597-67.398a91.35 91.35 0 0 1 5.372-21.486l3.727-9.71C51.78 85.425 69.347 67.93 90.508 58.51c21.16-9.422 45.916-10.77 69.25-1.814a90.51 90.51 0 0 1 18.487 9.673l58.923 40.1c16.674 11.348 27.17 28.38 30.66 46.743Z"
                    stroke={color}
                    strokeWidth={2.7}
                />
                <Path
                    d="m198.667 48.76.474.185a88.76 88.76 0 0 0-13.658.167c-16.614 1.476-33.577 7.591-49.825 18.55l-26.122 17.62c-16.248 10.96-28.272 24.397-35.864 39.248-7.593 14.851-10.755 31.116-9.278 47.73 1.476 16.615 7.59 33.578 18.55 49.826 10.96 16.248 24.398 28.272 39.249 35.865a89.451 89.451 0 0 0 7.974 3.599c-11.83-.774-23.322-3.948-34.074-9.445-14.851-7.593-28.29-19.616-39.249-35.865-10.96-16.248-17.074-33.211-18.55-49.825-1.477-16.615 1.685-32.88 9.278-47.73 7.592-14.852 19.616-28.29 35.864-39.25l26.122-17.618c16.248-10.96 33.211-17.074 49.825-18.55 13.517-1.202 26.803.667 39.284 5.494Z"
                    fill="#FFF"
                    opacity={0.2}
                />
            </G>
        </Svg>
    );
};

const styles = StyleSheet.create({
    rightBlob: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 3,
        right: -(SCREEN_WIDTH / 4),
    },
    bottomBlob: {
        position: 'absolute',
        bottom: 30,
        left: -(SCREEN_WIDTH / 2),
    },
    topBlob: {
        position: 'absolute',
        top: -20,
        left: -(SCREEN_WIDTH / 4),
    },
    centerBlob: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 2,
        left: -(SCREEN_WIDTH / 2),
    },
    default: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

Blob.propTypes = {
    size: PropTypes.number,
    style: PropTypes.shape({}),
    color: PropTypes.string,
    top: PropTypes.bool,
    bottom: PropTypes.bool,
    right: PropTypes.bool,
};
Blob.defaultProps = {
    size: 319,
    color: LAVENDER,
    style: null,
    top: false,
    bottom: false,
    right: false,
};

export default Blob;
