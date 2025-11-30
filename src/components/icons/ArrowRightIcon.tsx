import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const ArrowRightIcon: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M12.5 18s6-4.419 6-6c0-1.581-6-6-6-6M5.5 18s6-4.419 6-6c0-1.581-6-6-6-6" />
        </Svg>
    );
};

export default ArrowRightIcon;
