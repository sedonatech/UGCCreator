import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const ProfileIcon: React.FC<IconProps> = ({
    color = BLACK,
    size,
    style
}) => {
    const ratio = 23 / 22;

    return (
        <Svg
            width={size}
            height={size && size / ratio}
            style={style}
            viewBox="0 0 23 22"
            fill="none"
        >
            <Path
                d="M11.647 9.964a1.666 1.666 0 00-.303 0 4.052 4.052 0 01-3.914-4.06 4.067 4.067 0 014.07-4.07 4.066 4.066 0 01.147 8.13zM7.063 13.347c-2.218 1.485-2.218 3.905 0 5.38 2.521 1.687 6.655 1.687 9.176 0 2.218-1.485 2.218-3.905 0-5.38-2.512-1.678-6.646-1.678-9.176 0z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default ProfileIcon;
