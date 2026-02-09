import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const Language: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M7 8.38h4.5m5.5 0h-2.5m-3 0h3m-3 0V7m3 1.38c-.527 1.886-1.632 3.669-2.893 5.236M8.393 17c1.019-.937 2.17-2.087 3.214-3.384m0 0c-.643-.754-1.543-1.973-1.8-2.525m1.8 2.525l1.929 2.005" />
            <Path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109C18.717 21.5 16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391C2.5 18.717 2.5 16.479 2.5 12z" />
        </Svg>
    );
};

export default Language;
