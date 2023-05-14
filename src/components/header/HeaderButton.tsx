import React from 'react';
import { useNavigation } from '@react-navigation/native';

import TemplateIcon from '../TemplateIcon';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import {
    BLACK, BLACK_10, BLACK_20, BLACK_30
} from '../../theme/Colors';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';

export type HeaderIconButtonProps = {
    name: string;
    screen?: any;
    onPress?: () => void;
    backDropColor?: string
    mr?: number;
    ml?: number;
    title?: string;
    titleSize?: number;
    titleColor?: string;
};

const HeaderIconButton:React.FC<HeaderIconButtonProps> = ({
    name,
    onPress,
    screen,
    backDropColor = BLACK_10,
    mr,
    ml,
    title,
    titleSize = 10,
    titleColor = BLACK,

}) => {
    const { navigate } = useNavigation();
    // @ts-ignore
    const onNavigationPress = (onPress) || (() => navigate(screen));

    return (
    // @ts-ignore
        <TemplateBox
            onPress={onNavigationPress}
            mr={mr}
            ml={ml}
            pv={6}
            ph={10}
            backgroundColor={backDropColor}
            borderRadius={8}
        >
            {title ? (
                <TemplateText color={BLACK} size={9} bold caps>{title}</TemplateText>
            ) : (
                <TemplateIcon
                    name={name}
                    color={BLACK}
                    size={24}
                />
            )}
        </TemplateBox>
    );
};

export default HeaderIconButton;
