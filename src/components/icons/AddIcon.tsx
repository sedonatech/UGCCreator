import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const AddIcon: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M12.001 5v14.002M19.002 12.002H5" />
        </Svg>
    );
};

export default AddIcon;
