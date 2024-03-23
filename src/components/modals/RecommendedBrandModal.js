import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import ModalBase from './ModalBase';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';
import { BLACK, WHITE } from '../../theme/Colors';
import Button from '../Button';
import { WRAPPER_MARGIN } from '../../theme/Layout';

const RecommendedBrandModal = ({
    visible,
    closeOnPress,
    title,
    subtitle,
    buttonTitle,
    secondaryButtonTitle,
    onSecondaryButtonPress,
    onClose,
    height,
    width,
}) => (
    <ModalBase
        visible={visible}
        closeOnPress={onClose}
        animationInTiming={250}
    >
        <TemplateBox
            borderRadius={10}
            alignItems="center"
            justifyContent="center"
            pAll={WRAPPER_MARGIN}
            selfCenter
            backgroundColor={WHITE}
            height={height}
            width={width}
        >
            <TemplateText color={BLACK} size={20} bold>
                {title}
            </TemplateText>
            <TemplateBox height={20} />
            <TemplateText center color={BLACK} size={16}>
                {subtitle}
            </TemplateText>
            <TemplateBox height={20} />
            {!!closeOnPress && (
                <Button
                    title={buttonTitle}
                    onPress={closeOnPress}
                    style={styles.button}
                />
            )}

            <Button
                title={secondaryButtonTitle}
                onPress={onSecondaryButtonPress}
                style={styles.button}
            />
        </TemplateBox>

    </ModalBase>
);

RecommendedBrandModal.propTypes = {
    visible: PropTypes.bool,
    closeOnPress: PropTypes.func,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    buttonTitle: PropTypes.string,
    secondaryButtonTitle: PropTypes.string,
    onSecondaryButtonPress: PropTypes.func,
    onClose: PropTypes.func,
    height: PropTypes.string,
    width: PropTypes.string,
};

RecommendedBrandModal.defaultProps = {
    visible: false,
    closeOnPress: null,
    title: 'Profile Incomplete',
    subtitle: 'Please complete your profile before you can use the features of the app .',
    buttonTitle: 'Complete Profile',
    secondaryButtonTitle: '',
    onSecondaryButtonPress: () => {
    },
    onClose: () => {
    },
    height: '60%',
    width: '88%',
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: 220,
        height: 40,
    },
});
export default RecommendedBrandModal;
