/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { ZINC_900, ZINC_500, WHITE, GRAY_200, GRAY_900, AMBER_500 } from '../../../../theme/Colors';
import useTranslation from '../../../../hooks/useTranslation';

const CourseDetailsCard = ({ course, totalDays }) => {
    const { t } = useTranslation();
    return (
        <TemplateBox style={styles.detailsCard}>
            <TemplateText size={20} semiBold color={styles.textPrimary.color} mb={8}>
                {course?.title || 'Course'}
            </TemplateText>
            <TemplateText size={14} color={styles.textMuted.color} lineHeight={20} mb={12}>
                {course?.description || 'Course details are loading.'}
            </TemplateText>
            <TemplateBox row alignItems="center" style={styles.metaRow}>
                <TemplateBox row alignItems="center" mr={16}>
                    <TemplateIcon name="time-outline" size={14} color={styles.textMuted.color} />
                    <TemplateText size={12} color={styles.textMuted.color} ml={6}>
                        {t('courses.details.days', { count: totalDays || 0 })}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox row alignItems="center" mr={16}>
                    <TemplateIcon name="checkmark-circle-outline" size={14} color={styles.textMuted.color} />
                    <TemplateText size={12} color={styles.textMuted.color} ml={6}>
                        {t('courses.details.tasks', { count: (course?.days?.length || 0) * 4 })}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox row alignItems="center">
                    <TemplateIcon name="trophy-outline" size={14} color={AMBER_500} />
                    <TemplateText size={12} color={styles.textMuted.color} ml={6}>
                        {t('courses.details.certificate')}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );
};

CourseDetailsCard.propTypes = {
    course: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        days: PropTypes.array,
    }),
    totalDays: PropTypes.number,
};

export default CourseDetailsCard;

const styles = StyleSheet.create({
    detailsCard: {
        marginHorizontal: 24,
        marginTop: -24,
        borderRadius: 20,
        padding: 18,
        backgroundColor: WHITE,
        borderWidth: 1,
        borderColor: GRAY_200,
        shadowColor: GRAY_900,
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    metaRow: {
        flexWrap: 'wrap',
    },
    textPrimary: {
        color: ZINC_900,
    },
    textMuted: {
        color: ZINC_500,
    },
});
