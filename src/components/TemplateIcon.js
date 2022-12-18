import React from 'react';

import PropTypes from 'prop-types';
import {startCase} from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {BLUE_SECONDARY} from '../theme/Colors';

const getIcon = iconFamily => {
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

const TemplateIcon = ({name, family, size, color, style, ...rest}) => {
  const Icon = getIcon(startCase(family));

  return <Icon name={name} size={size} color={color} style={style} {...rest} />;
};

TemplateIcon.propTypes = {
  name: PropTypes.string,
  family: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
TemplateIcon.defaultProps = {
  name: 'account',
  family: 'MaterialCommunity',
  size: 15,
  color: BLUE_SECONDARY,
  style: null,
};

export default TemplateIcon;
