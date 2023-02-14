import React from 'react';
import { useNavigation } from '@react-navigation/native';

import TemplateIcon from '../TemplateIcon';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import {
    BLACK, BLACK_10, BLACK_20, BLACK_30
} from '../../theme/Colors';
import TemplateBox from '../TemplateBox';

export type HeaderIconButtonProps = {
    name: string;
    screen?: any;
    onPress?: () => void;

    backDropColor?: string

    mr?: number;
    ml?: number;
};

const HeaderIconButton:React.FC<HeaderIconButtonProps> = ({
    name,
    onPress,
    screen,
    backDropColor = BLACK_10,
    mr,
    ml
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
            pAll={6}
            backgroundColor={backDropColor}
            borderRadius={10}
        >
            <TemplateIcon
                name={name}
                color={BLACK}
                size={24}
            />
        </TemplateBox>
    );
};

export default HeaderIconButton;
