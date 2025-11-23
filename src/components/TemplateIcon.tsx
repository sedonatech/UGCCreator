import React, { FC } from 'react';
import FontAwesome5 from '@react-native-vector-icons/ionicons';
import { BLUE_SECONDARY } from '../theme/Colors';

interface Props {
    name: string;
    size?: number;
    color?: string;
    style?: object | object[];
}

const TemplateIcon: FC<Props> = ({ name, size = 15, color = BLUE_SECONDARY, style, ...rest }) => {
    return <FontAwesome5 name={name} size={size} color={color} style={style} {...rest} iconStyle="solid" />;
};

export default TemplateIcon;
