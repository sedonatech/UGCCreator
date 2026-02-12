/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { ZINC_500, SLATE_50, GRAY_200, INDIGO_700, INDIGO_PURPLE_GRADIENT } from '../../../../theme/Colors';
import useTranslation from '../../../../hooks/useTranslation';

const CourseProgressCard = ({ progress, currentDayNumber, totalDays, completionRatio }) => {
    const { t } = useTranslation();
    return (
        <TemplateBox style={styles.progressCard}>
            <TemplateBox row alignItems="center" justifyContent="space-between" mb={10}>
                <TemplateText size={12} medium color={styles.textMuted.color}>
                    {t('courses.details.yourProgress')}
                </TemplateText>
                <TemplateText size={12} semiBold color={INDIGO_700}>
                    {t('courses.details.dayOfTotal', { current: currentDayNumber, total: totalDays || 0 })}
                </TemplateText>
            </TemplateBox>
            <TemplateBox style={styles.progressTrack}>
                <LinearGradient
                    colors={INDIGO_PURPLE_GRADIENT}
                    style={[styles.progressFill, { width: `${completionRatio}%` }]}
                />
            </TemplateBox>
            <TemplateBox row alignItems="center" justifyContent="space-between" mt={8}>
                <TemplateText size={11} color={styles.textMuted.color}>
                    {t('courses.details.daysCompleted', { count: progress?.completedDays?.length || 0 })}
                </TemplateText>
                <TemplateText size={11} color={styles.textMuted.color}>
                    {t('courses.details.daysRemaining', {
                        count: (totalDays || 0) - (progress?.completedDays?.length || 0),
                    })}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
    );
};

CourseProgressCard.propTypes = {
    progress: PropTypes.shape({
        completedDays: PropTypes.array,
    }),
    currentDayNumber: PropTypes.number,
    totalDays: PropTypes.number,
    completionRatio: PropTypes.number,
};

export default CourseProgressCard;

const styles = StyleSheet.create({
    progressCard: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: SLATE_50,
        borderWidth: 1,
        borderColor: GRAY_200,
    },
    progressTrack: {
        height: 6,
        borderRadius: 999,
        backgroundColor: GRAY_200,
        overflow: 'hidden',
    },
    progressFill: {
        width: '10%',
        height: '100%',
        borderRadius: 999,
    },
    textMuted: {
        color: ZINC_500,
    },
});
