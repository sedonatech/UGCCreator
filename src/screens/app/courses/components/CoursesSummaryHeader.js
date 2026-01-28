/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { ZINC_900, ZINC_500, ZINC_200, GRAY_200, INDIGO_PURPLE_GRADIENT, WHITE } from '../../../../theme/Colors';

const CoursesSummaryHeader = ({ summary }) => {
    return (
        <TemplateBox style={styles.hero}>
            <TemplateBox row alignItems="center" justifyContent="space-between" mb={18}>
                <TemplateBox>
                    <TemplateText size={12} color={styles.textMuted.color} style={styles.uppercase}>
                        Your Progress
                    </TemplateText>
                    <TemplateText size={24} semiBold color={styles.textPrimary.color}>
                        {summary.courseCount || 0} Courses
                    </TemplateText>
                </TemplateBox>
                <TemplateBox row alignItems="center">
                    <LinearGradient colors={INDIGO_PURPLE_GRADIENT} style={styles.heroBadge}>
                        <TemplateIcon name="flame" size={20} color={WHITE} />
                    </LinearGradient>
                    <TemplateBox ml={10}>
                        <TemplateText size={18} semiBold color={styles.textPrimary.color}>
                            {summary.streak || 0}
                        </TemplateText>
                        <TemplateText size={12} color={styles.textMuted.color}>
                            Day Streak
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox style={styles.progressTrack}>
                <LinearGradient
                    colors={INDIGO_PURPLE_GRADIENT}
                    style={[styles.progressFill, { width: `${summary.completionRatio}%` }]}
                />
            </TemplateBox>
            <TemplateText size={12} color={styles.textMuted.color} mt={8}>
                {summary.completionRatio}% overall completion
            </TemplateText>
        </TemplateBox>
    );
};

CoursesSummaryHeader.propTypes = {
    summary: PropTypes.shape({
        courseCount: PropTypes.number,
        completionRatio: PropTypes.number,
        streak: PropTypes.number,
    }).isRequired,
};

export default CoursesSummaryHeader;

const styles = StyleSheet.create({
    hero: {
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: ZINC_200,
    },
    heroBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressTrack: {
        height: 6,
        borderRadius: 999,
        backgroundColor: GRAY_200,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '35%',
        borderRadius: 999,
    },
    uppercase: {
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    textPrimary: {
        color: ZINC_900,
    },
    textMuted: {
        color: ZINC_500,
    },
});
