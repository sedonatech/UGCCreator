import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { BRAND_BLUE } from '../../src/theme/Colors';

const LineSvg = ({
    height, width, color, ...props
}) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 2 79"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path d="M1 1l.306 77.006" stroke={color} strokeDasharray="2 4 4 4" />
    </Svg>
);

LineSvg.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    color: PropTypes.string,
};

LineSvg.defaultProps = {
    height: 70,
    width: 3,
    color: BRAND_BLUE,
};
export default LineSvg;
