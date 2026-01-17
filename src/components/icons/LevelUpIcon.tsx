import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {BLACK} from '../../theme/Colors';
import {IconProps} from './IconProps';

const LevelUpIcon: React.FC<IconProps> = ({color = BLACK, size, style}) => {
  const ratio = 24 / 24;

  return (
    <Svg
      width={size}
      height={size && size / ratio}
      style={style}
      viewBox="0 0 24 24"
       color="#000"
      fill="none"
      stroke="#141B34"
      strokeWidth={1.5}
      strokeLinejoin="round"
      >
      <Path d="M20.5 10.5v9c0 .466 0 .699-.076.883a1 1 0 01-.541.54C19.699 21 19.466 21 19 21s-.699 0-.883-.076a1 1 0 01-.54-.541c-.077-.184-.077-.417-.077-.883v-9c0-.466 0-.699.076-.883a1 1 0 01.541-.54C18.301 9 18.534 9 19 9s.699 0 .883.076a1 1 0 01.54.541c.077.184.077.417.077.883zM16.5 3h3v3M19 3.5s-4 5-14.5 8.5M13.5 14v5.5c0 .466 0 .699-.076.883a1 1 0 01-.541.54C12.699 21 12.466 21 12 21s-.699 0-.883-.076a1 1 0 01-.54-.541c-.077-.184-.077-.417-.077-.883V14c0-.466 0-.699.076-.883a1 1 0 01.541-.54c.184-.077.417-.077.883-.077s.699 0 .883.076a1 1 0 01.54.541c.077.184.077.417.077.883zM6.5 16.5v3c0 .466 0 .699-.076.883a1 1 0 01-.541.54C5.699 21 5.466 21 5 21s-.699 0-.883-.076a1 1 0 01-.54-.541c-.077-.184-.077-.417-.077-.883v-3c0-.466 0-.699.076-.883a1 1 0 01.541-.54C4.301 15 4.534 15 5 15s.699 0 .883.076a1 1 0 01.54.541c.077.184.077.417.077.883z" />
   </Svg>
  );
};

export default LevelUpIcon;
