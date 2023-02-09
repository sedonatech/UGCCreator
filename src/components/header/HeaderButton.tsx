import React from 'react';
import { useNavigation } from '@react-navigation/native';

import TemplateIcon from '../TemplateIcon';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import { BLACK } from '../../theme/Colors';
import TemplateBox from '../TemplateBox';

export type HeaderIconButtonProps = {
    name: string;
    screen?: any;
    onPress?: () => void;
};

const HeaderIconButton:React.FC<HeaderIconButtonProps> = ({ name, onPress, screen }) => {
    const { navigate } = useNavigation();
    // @ts-ignore
    const onNavigationPress = (onPress) || (() => navigate(screen));

    return (
    // @ts-ignore
        <TemplateBox
            onPress={onNavigationPress}
            mr={WRAPPER_MARGIN}
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
