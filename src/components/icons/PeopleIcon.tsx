import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {BLACK} from '../../theme/Colors';
import {IconProps} from './IconProps';

const PeopleIcon: React.FC<IconProps> = ({color = BLACK, size, style}) => {
  const ratio = 24 / 24;

  return (
    <Svg
      width={size}
      height={size && size / ratio}
      style={style}
      viewBox="0 0 24 24"
      fill="none">
      <Path
        d="M17 17a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0 0a4.5 4.5 0 014.5 4.5M17 17a4.5 4.5 0 00-4.5 4.5M7 7.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0 0a4.5 4.5 0 014.5 4.5M7 7.5A4.5 4.5 0 002.5 12M3.5 15.5c0 2.764 2.236 5 5 5l-.5-2M18.5 8.5c0-2.764-2.236-5-5-5l.5 2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PeopleIcon;
