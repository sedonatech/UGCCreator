import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {
    Rect, G, Path, Defs, ClipPath,
} from 'react-native-svg';
import { GREEN } from '../../src/theme/Colors';

const AddButtonLargeSvg = ({
    width,
    height,
    style,
    color,
}) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 334 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
    >
        <Rect
            x={1}
            y={1}
            width={332}
            height={60}
            rx={16}
            fill="#fff"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray="8 8"
        />
        <G clipPath="url(#clip0_264_2565)">
            <Path
                d="M174.78 32.542h-5.615v-5.75a.968.968 0 00-.274-.678.923.923 0 00-1.323 0 .968.968 0 00-.274.678v5.75h-5.615c-.248 0-.486.1-.662.28a.972.972 0 000 1.356c.176.18.414.28.662.28h5.615v5.75c0 .255.098.498.274.678a.923.923 0 001.323 0 .968.968 0 00.274-.678v-5.75h5.615c.248 0 .486-.1.662-.28a.972.972 0 000-1.356.926.926 0 00-.662-.28z"
                fill={color}
            />
        </G>
        <Defs>
            <ClipPath id="clip0_264_2565">
                <Path
                    fill="#fff"
                    transform="translate(157 22)"
                    d="M0 0H22.4588V23H0z"
                />
            </ClipPath>
        </Defs>
    </Svg>
);

AddButtonLargeSvg.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.shape({}),
    color: PropTypes.string,
};

AddButtonLargeSvg.defaultProps = {
    width: 334,
    height: 62,
    style: {},
    color: GREEN,
};
export default AddButtonLargeSvg;
