import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import ModalBase from './ModalBase';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';
import { BLACK, WHITE } from '../../theme/Colors';
import Button from '../Button';
import { WRAPPER_MARGIN } from '../../theme/Layout';

const ProfileIncompleteModal = ({
    visible,
    closeOnPress,
    title,
    subtitle,
    buttonTitle,
}) => (
    <ModalBase
        visible={visible}
        closeOnPress={closeOnPress}
    >
        <TemplateBox
            borderRadius={10}
            alignItems="center"
            justifyContent="center"
            pAll={WRAPPER_MARGIN}
            selfCenter
            backgroundColor={WHITE}
            height="40%"
            width="86%"
        >
            <TemplateText color={BLACK} size={20} bold>
                {title}
            </TemplateText>
            <TemplateBox height={20} />
            <TemplateText center color={BLACK} size={16}>
                {subtitle}
            </TemplateText>
            <TemplateBox height={20} />
            <Button
                title={buttonTitle}
                onPress={closeOnPress}
                style={styles.button}
            />

        </TemplateBox>

    </ModalBase>
);

ProfileIncompleteModal.propTypes = {
    visible: PropTypes.bool,
    closeOnPress: PropTypes.func,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    buttonTitle: PropTypes.string,
};

ProfileIncompleteModal.defaultProps = {
    visible: false,
    closeOnPress: () => {
    },
    title: 'Profile Incomplete',
    subtitle: 'Please complete your profile before you can use the features of the app .',
    buttonTitle: 'Complete Profile',
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: 180,
        height: 40,
    },
});
export default ProfileIncompleteModal;
