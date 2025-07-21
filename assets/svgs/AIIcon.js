/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { G, Path, Circle } from 'react-native-svg';

const AIIcon = ({ size = 24, color = '#ffffff', ...props }) => {
    const ratio = 24 / 24;
    return (
        <Svg
            width={size}
            height={size && size / ratio}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G
                stroke={color}
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <Path d="M7.245 14.781l2.993-3.89 3.414 2.682 2.93-3.78" />
                <Circle cx={19.9954} cy={4.20027} r={1.9222} />
                <Path d="M14.925 3.12H7.657c-3.012 0-4.879 2.133-4.879 5.144v8.083c0 3.011 1.83 5.135 4.879 5.135h8.604c3.011 0 4.879-2.124 4.879-5.135v-7.04" />
            </G>
        </Svg>
    );
};
AIIcon.propTypes = {
    size: PropTypes.number,
};

AIIcon.defaultProps = {
    size: 24,
};
export default AIIcon;
