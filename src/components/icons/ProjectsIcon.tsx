import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const Create: React.FC<IconProps> = ({
    color = BLACK ,
    size,
    style
}) => {
    const ratio = 25 / 24;

    return (
        <Svg
            width={size}
            height={size && size / ratio}
            style={style}
            viewBox="0 0 25 24"
            fill="none"
        >
             <Path
                d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109C18.717 21.5 16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391C2.5 18.717 2.5 16.479 2.5 12z"
                stroke={color}
                strokeWidth={1.5}
            />
            <Path
                d="M12 8v8M9 10v4M6 11v2M15 10v4M18 11v2"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default Create;
