import React from 'react';
import {
    StyleSheet, ViewStyle
} from 'react-native';

import Modal from 'react-native-modal';
import { WHITE } from '../../theme/Colors';

export interface ModalBaseProps {
    closeOnPress:()=>void;
    visible:boolean;
    style?:ViewStyle | ViewStyle[] | null;
    children?:any;
}

const ModalBase:React.FC<ModalBaseProps> = ({
    visible,
    closeOnPress,
    style,
    children,
    ...restProps
}) => (
    <Modal
        isVisible={visible}
        onSwipeComplete={closeOnPress}
        onBackdropPress={closeOnPress}
        style={[styles.modal, style]}
        {...restProps}
    >
        {children}
    </Modal>
);

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        backgroundColor: WHITE,
    },
});

export default ModalBase;
