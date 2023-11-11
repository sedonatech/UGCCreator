import React, { FC } from 'react';

// @ts-ignore
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import FeatherIcon from 'react-native-vector-icons/Feather';
// @ts-ignore
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
// @ts-ignore
import EntypoIcon from 'react-native-vector-icons/Entypo';
// @ts-ignore
import EvilIcons from 'react-native-vector-icons/EvilIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// @ts-ignore
import Fontisto from 'react-native-vector-icons/Fontisto';
// @ts-ignore
import Foundation from 'react-native-vector-icons/Foundation';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import Octicons from 'react-native-vector-icons/Octicons';
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import Zocial from 'react-native-vector-icons/Zocial';
import { BLUE_SECONDARY } from '../theme/Colors';

const getIcon = (iconFamily: string) => {
    switch (iconFamily) {
        case 'Material':
            return MaterialIcon;
        case 'MaterialCommunity':
            return MaterialCommunityIcons;
        case 'Feather':
            return FeatherIcon;
        case 'AntDesign':
            return AntDesignIcon;
        case 'Entypo':
            return EntypoIcon;
        case 'Evil':
            return EvilIcons;
        case 'FontAwesome':
            return FontAwesome;
        case 'FontAwesome5':
            return FontAwesome5;
        case 'Fontisto':
            return Fontisto;
        case 'Foundation':
            return Foundation;
        case 'Ionicons':
            return Ionicons;
        case 'Octicons':
            return Octicons;
        case 'SimpleLineIcons':
            return SimpleLineIcons;
        case 'Zocial':
            return Zocial;
        default:
            return MaterialCommunityIcons;
    }
};

interface Props {
    name: string,
    family?: string,
    size?: number,
    color?: string,
    style?: object | object[],
}
const TemplateIcon: FC<Props> = ({
    name, family = 'Ionicons', size = 15, color = BLUE_SECONDARY, style, ...rest
}) => {
    const Icon = getIcon(family);

    return <Icon name={name} size={size} color={color} style={style} {...rest} />;
};

export default TemplateIcon;
