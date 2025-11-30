import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const LikesIcon: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
    const ratio = 24 / 24;

    return (
        <Svg
            width={size}
            height={size && size / ratio}
            viewBox="0 0 24 24"
            color={color}
            stroke={color}
            style={style}
            fill="none"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M10.41 19.968C7.59 17.858 2 13.035 2 8.694 2 5.826 4.105 3.5 7 3.5c1.5 0 3 .5 5 2.5 2-2 3.5-2.5 5-2.5 2.895 0 5 2.326 5 5.194 0 4.34-5.59 9.164-8.41 11.274-.95.71-2.23.71-3.18 0z" />
        </Svg>
    );
};

export default LikesIcon;
