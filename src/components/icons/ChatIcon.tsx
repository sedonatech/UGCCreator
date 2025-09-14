import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {BLACK} from '../../theme/Colors';
import {IconProps} from './IconProps';

const ChatIcon: React.FC<IconProps> = ({color = BLACK, size, style}) => {
  const ratio = 25 / 24;

  return (
    <Svg
      width={size}
      height={size && size / ratio}
      style={style}
      viewBox="0 0 25 24"
      fill="none">
      <Path
        d="M21.5 11.996a9.5 9.5 0 01-9.5 9.5 9.457 9.457 0 01-4.567-1.168c-.553-.304-1.205-.41-1.803-.21L3 20.993l.877-2.631c.2-.599.093-1.25-.21-1.803A9.458 9.458 0 012.5 11.996a9.5 9.5 0 019.5-9.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 9.496a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChatIcon;
