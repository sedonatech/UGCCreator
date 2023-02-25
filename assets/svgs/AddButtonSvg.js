import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {
    Rect, G, Path, Defs, ClipPath,
} from 'react-native-svg';
import { GREEN } from '../../src/theme/Colors';

const AddButtonSvg = ({
    width,
    height,
    style,
    color,
}) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
    >
        <Rect
            x={1}
            y={1}
            width={101}
            height={101}
            rx={16}
            fill="#fff"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray="8 8"
        />
        <G clipPath="url(#clip0_264_2565)">
            <Path
                d="M59 51h-6v-6a1 1 0 00-2 0v6h-6a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"
                fill={color}
            />
        </G>
        <Defs>
            <ClipPath id="clip0_264_2565">
                <Path fill="#fff" transform="translate(40 40)" d="M0 0H24V24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);

AddButtonSvg.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.shape({}),
    color: PropTypes.string,
};

AddButtonSvg.defaultProps = {
    width: 103,
    height: 103,
    style: {},
    color: GREEN,
};
export default AddButtonSvg;
