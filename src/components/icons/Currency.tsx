import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '../../theme/Colors';
import { IconProps } from './IconProps';

const Currency: React.FC<IconProps> = ({ color = BLACK, size, style }) => {
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
            <Path d="M6.234 7c-1.63 0-2.445 0-2.906.495-.461.495-.36 1.262-.158 2.796.06.447.158.702.457 1.05.969 1.122 2.742 3.118 5.23 4.933.228.166.377.437.402.737.084.994.165 1.895.242 2.699.124 1.306.187 1.959.662 2.206.476.247 1.07-.07 2.259-.702l1.066-.567c.44-.235.66-.352.797-.55.137-.197.164-.436.22-.912.072-.615.148-1.335.226-2.174.027-.297.176-.565.402-.73 2.493-1.817 4.27-3.817 5.24-4.94.3-.348.398-.602.457-1.05.202-1.534.303-2.3-.158-2.796C20.212 7 19.396 7 17.766 7" />
            <Path d="M9.625 9.5v-6m1.875 0V2m0 9V9.5m-1.875-3h3.75m0 0c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H8.5m4.875-3c.621 0 1.125-.504 1.125-1.125v-.75c0-.621-.504-1.125-1.125-1.125H8.5" />
        </Svg>
    );
};

export default Currency;
