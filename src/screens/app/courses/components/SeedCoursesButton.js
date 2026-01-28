import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { INDIGO_700, INDIGO_BG_14, INDIGO_BORDER_35 } from '../../../../theme/Colors';

const SeedCoursesButton = ({ onPress }) => {
    return (
        <TemplateBox onPress={onPress} style={styles.seedPill} center>
            <TemplateText size={10} semiBold color={INDIGO_700}>
                Seed Courses
            </TemplateText>
        </TemplateBox>
    );
};

SeedCoursesButton.propTypes = {
    onPress: PropTypes.func.isRequired,
};

export default SeedCoursesButton;

const styles = StyleSheet.create({
    seedPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: INDIGO_BG_14,
        borderWidth: 1,
        borderColor: INDIGO_BORDER_35,
    },
});
