import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const SaveIcon: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M3 17.98v-5.273c0-3.633 0-5.45 1.098-6.578C5.197 5 6.964 5 10.5 5s5.303 0 6.402 1.129C18 7.257 18 9.074 18 12.708v5.273c0 2.306 0 3.459-.724 3.871-1.404.8-4.035-1.867-5.285-2.67-.725-.465-1.088-.698-1.491-.698s-.766.233-1.49.698c-1.25.803-3.882 3.47-5.285 2.67C3 21.44 3 20.287 3 17.981z" />
            <Path d="M9 2h2c4.714 0 7.071 0 8.535 1.464C21 4.93 21 7.286 21 12v6" />
        </Svg>
    );
};

export default SaveIcon;
