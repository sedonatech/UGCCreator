import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

const Filter = ({ height, width, ...props }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 27 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path d="M1 0v18" stroke="#E3E7EC" />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.04 10.281a2.33 2.33 0 012.335 2.322 2.33 2.33 0 01-2.334 2.322 2.332 2.332 0 01-2.336-2.322 2.332 2.332 0 012.336-2.322zm0 1.125c-.667 0-1.21.537-1.21 1.197s.543 1.197 1.21 1.197c.668 0 1.21-.536 1.21-1.197 0-.66-.542-1.197-1.21-1.197zm-5.48.664a.563.563 0 010 1.125h-4.725a.563.563 0 010-1.125h4.725zM13.585 3a2.332 2.332 0 012.334 2.323 2.33 2.33 0 01-2.334 2.321 2.33 2.33 0 01-2.335-2.321A2.332 2.332 0 0113.585 3zm0 1.125c-.667 0-1.21.537-1.21 1.198 0 .66.543 1.196 1.21 1.196.667 0 1.21-.536 1.21-1.196 0-.661-.543-1.198-1.21-1.198zm9.808.675a.563.563 0 010 1.125h-4.725a.563.563 0 010-1.125h4.725z"
            fill="#171725"
        />
    </Svg>
);

Filter.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
};

Filter.defaultProps = {
    height: 18,
    width: 27,
};

export default Filter;
