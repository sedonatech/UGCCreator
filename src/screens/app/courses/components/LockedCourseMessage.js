/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { ZINC_500, GRAY_50, GRAY_200, GRAY_400 } from '../../../../theme/Colors';

const LockedCourseMessage = ({ isComingSoon }) => {
    return (
        <TemplateBox style={styles.lockedCard}>
            <TemplateIcon name="lock-closed" size={18} color={GRAY_400} />
            <TemplateText size={13} color={styles.textMuted.color} ml={10}>
                {isComingSoon ? 'This course unlocks next month.' : 'Upgrade to premium to access this course.'}
            </TemplateText>
        </TemplateBox>
    );
};

LockedCourseMessage.propTypes = {
    isComingSoon: PropTypes.bool,
};

export default LockedCourseMessage;

const styles = StyleSheet.create({
    lockedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: GRAY_200,
        backgroundColor: GRAY_50,
        marginBottom: 12,
    },
    textMuted: {
        color: ZINC_500,
    },
});
