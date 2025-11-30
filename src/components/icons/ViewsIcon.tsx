import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const ViewsIcon: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M2 8s4.477-5 10-5 10 5 10 5" />
            <Path d="M21.544 13.045c.304.426.456.64.456.955 0 .316-.152.529-.456.955C20.178 16.871 16.689 21 12 21c-4.69 0-8.178-4.13-9.544-6.045C2.152 14.529 2 14.315 2 14c0-.316.152-.529.456-.955C3.822 11.129 7.311 7 12 7c4.69 0 8.178 4.13 9.544 6.045z" />
            <Path d="M15 14a3 3 0 10-6 0 3 3 0 006 0z" />
        </Svg>
    );
};

export default ViewsIcon;
