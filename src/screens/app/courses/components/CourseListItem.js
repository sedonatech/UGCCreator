/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import CourseAvatarStack from './CourseAvatarStack';
import {
    ZINC_900,
    ZINC_500,
    GRAY_200,
    GRAY_300,
    GRAY_400,
    GRAY_100,
    INDIGO_200,
    INDIGO_600,
    INDIGO_700,
    INDIGO_BG_16,
    INDIGO_BG_18,
    INDIGO_BORDER_35,
    COURSE_GRADIENT_DEFAULT,
} from '../../../../theme/Colors';

const CourseListItem = ({ course, progress, onPress, formatUnlockDate }) => {
    const totalDays = course?.totalDays || course?.days?.length || 0;
    const completedDays = progress?.completedDays?.length || 0;
    const completionRatio = totalDays ? Math.round((completedDays / totalDays) * 100) : 0;
    const currentDay = progress?.currentDay || 1;
    const isComingSoon = course?.releaseAt && course.releaseAt > new Date();
    const isLocked = isComingSoon;

    const statusLabel = isComingSoon ? 'Coming Soon' : isLocked ? 'Premium' : 'In Progress';
    const statusPillStyle = isLocked ? styles.comingSoonPill : styles.statusPill;
    const iconStyle = isLocked ? styles.iconMutedWrap : styles.iconWrap;
    const cardStyle = isLocked ? styles.comingSoonCard : styles.courseCard;
    const unlockLabel = isComingSoon ? formatUnlockDate(course.releaseAt) : null;

    return (
        <TemplateBox
            onPress={isLocked ? null : onPress}
            borderRadius={20}
            overflow="hidden"
            borderWidth={1}
            borderColor={isLocked ? GRAY_200 : INDIGO_200}
            style={cardStyle}
            disabled={isLocked}
        >
            {!isLocked && (
                <TemplateBox
                    absolute
                    top={0}
                    bottom={0}
                    left={0}
                    right={0}
                    fullGradient
                    gradientColors={course?.gradient || COURSE_GRADIENT_DEFAULT}
                    borderRadius={20}
                />
            )}
            <TemplateBox pAll={18}>
                <TemplateBox row alignItems="center" justifyContent="space-between" mb={14}>
                    <TemplateBox style={iconStyle} center>
                        <TemplateIcon name={course?.icon} size={20} color={isLocked ? ZINC_500 : course?.accent} />
                    </TemplateBox>
                    <TemplateBox style={statusPillStyle} center>
                        <TemplateText size={14} color={isLocked ? ZINC_500 : INDIGO_700} medium>
                            {statusLabel}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>

                <TemplateText size={18} semiBold color={styles.textPrimary.color} mb={6}>
                    {course?.title}
                </TemplateText>
                <TemplateText size={14} color={styles.textMuted.color} lineHeight={18} mb={14}>
                    {course?.shortDescription}
                </TemplateText>

                <TemplateBox row alignItems="center" justifyContent="space-between">
                    <TemplateBox row alignItems="center">
                        <CourseAvatarStack />
                        <TemplateText size={14} color={styles.textMuted.color} ml={8}>
                            enrolled
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox row alignItems="center">
                        <TemplateText size={14} medium color={isLocked ? ZINC_500 : INDIGO_700} mr={6}>
                            {isComingSoon ? `Unlocks ${unlockLabel}` : `Day ${currentDay} of ${totalDays}`}
                        </TemplateText>
                        <TemplateIcon name="chevron-forward" size={16} color={GRAY_400} />
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
            <TemplateBox style={styles.cardProgressTrack}>
                <TemplateBox style={[styles.cardProgressFill, { width: `${completionRatio}%` }]} />
            </TemplateBox>
        </TemplateBox>
    );
};

CourseListItem.propTypes = {
    course: PropTypes.shape({
        totalDays: PropTypes.number,
        days: PropTypes.array,
        releaseAt: PropTypes.instanceOf(Date),
        gradient: PropTypes.array,
        icon: PropTypes.string,
        accent: PropTypes.string,
        title: PropTypes.string,
        shortDescription: PropTypes.string,
    }).isRequired,
    progress: PropTypes.shape({
        completedDays: PropTypes.array,
        currentDay: PropTypes.number,
    }),
    onPress: PropTypes.func.isRequired,
    formatUnlockDate: PropTypes.func.isRequired,
};

export default CourseListItem;

const styles = StyleSheet.create({
    courseCard: {
        marginTop: 16,
        shadowColor: INDIGO_600,
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: INDIGO_BG_16,
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: INDIGO_BG_18,
        borderWidth: 1,
        borderColor: INDIGO_BORDER_35,
    },
    cardProgressTrack: {
        height: 4,
        backgroundColor: GRAY_200,
    },
    cardProgressFill: {
        height: '100%',
        width: '10%',
        backgroundColor: INDIGO_600,
    },
    comingSoonCard: {
        marginTop: 16,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: GRAY_200,
        backgroundColor: GRAY_100,
        opacity: 0.6,
    },
    iconMutedWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: GRAY_200,
    },
    comingSoonPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: GRAY_200,
        borderWidth: 1,
        borderColor: GRAY_300,
    },
    textPrimary: {
        color: ZINC_900,
    },
    textMuted: {
        color: ZINC_500,
    },
});
