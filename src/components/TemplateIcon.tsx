import React, { FC } from 'react';
import IonIcon from '@react-native-vector-icons/ionicons';
import { PRIMARY } from '../theme/Colors';

interface Props {
    name: React.ComponentProps<typeof IonIcon>['name'];
    size?: number;
    color?: string;
    style?: object | object[];
}

const TemplateIcon: FC<Props> = ({ name, size = 15, color = PRIMARY, style, ...rest }) => {
    return <IonIcon name={name} size={size} color={color} style={style} {...rest} />;
};

export default TemplateIcon;
