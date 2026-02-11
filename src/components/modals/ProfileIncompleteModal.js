import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import ModalBase from './ModalBase';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';
import { BLACK, WHITE } from '../../theme/Colors';
import Button from '../Button';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import useTranslation from '../../hooks/useTranslation';

const ProfileIncompleteModal = ({
    visible,
    closeOnPress,
    title,
    subtitle,
    buttonTitle,
}) => {
    const { t } = useTranslation();
    return (
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
                {title || t('modals.profileIncomplete.defaultTitle')}
            </TemplateText>
            <TemplateBox height={20} />
            <TemplateText center color={BLACK} size={16}>
                {subtitle || t('modals.profileIncomplete.defaultSubtitle')}
            </TemplateText>
            <TemplateBox height={20} />
            <Button
                title={buttonTitle || t('modals.profileIncomplete.defaultButton')}
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
    title: null,
    subtitle: null,
    buttonTitle: null,
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: 180,
        height: 40,
    },
});
export default ProfileIncompleteModal;
