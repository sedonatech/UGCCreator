import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const LinkIcon: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M11.1 3c-3.65.007-5.56.096-6.782 1.318C3 5.636 3 7.757 3 12c0 4.242 0 6.364 1.318 7.682C5.636 21 7.757 21 12 21s6.363 0 7.68-1.318c1.222-1.221 1.312-3.133 1.318-6.782M20.556 3.496l-9.507 9.563m9.507-9.563c-.494-.494-3.822-.448-4.525-.438m4.525.438c.494.495.448 3.827.438 4.531" />
        </Svg>
    );
};

export default LinkIcon;
