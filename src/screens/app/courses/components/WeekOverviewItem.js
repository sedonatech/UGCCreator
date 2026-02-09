/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import useTranslation from '../../../../hooks/useTranslation';
import {
    ZINC_700,
    ZINC_500,
    WHITE,
    SLATE_50,
    GRAY_50,
    GRAY_200,
    GRAY_400,
    GRAY_600,
    INDIGO_50,
    INDIGO_200,
    INDIGO_600,
    EMERALD_100,
    EMERALD_500,
} from '../../../../theme/Colors';

const WeekOverviewItem = ({ day, isCompleted, isToday, isLocked, completedTasksCount, totalTasksCount }) => {
    const { t } = useTranslation();
    return (
        <TemplateBox
            style={[
                styles.weekCard,
                isLocked ? styles.weekCardLocked : isToday ? styles.weekCardActive : styles.weekCardMuted,
            ]}
        >
            <TemplateBox
                style={[
                    styles.weekIcon,
                    isLocked ? styles.weekIconLocked : isToday ? styles.weekIconActive : styles.weekIconSuccess,
                ]}
            >
                {isLocked && <TemplateIcon name="lock-closed" size={12} color={GRAY_400} />}
                {isCompleted && !isLocked && <TemplateIcon name="checkmark" size={12} color={EMERALD_500} />}
                {isToday && !isCompleted && (
                    <TemplateText size={10} color={WHITE} semiBold>
                        {day.day}
                    </TemplateText>
                )}
            </TemplateBox>
            <TemplateBox style={styles.weekContent}>
                <TemplateText size={13} medium color={isLocked ? GRAY_600 : styles.textSecondary.color}>
                    {t('courses.weekItem.dayTitle', { number: day.day, title: day.title })}
                </TemplateText>
                <TemplateText size={11} color={isLocked ? GRAY_400 : styles.textMuted.color}>
                    {isLocked
                        ? t('courses.weekItem.locked')
                        : t('courses.weekItem.tasksCompleted', {
                              completed: completedTasksCount,
                              total: totalTasksCount,
                          })}
                </TemplateText>
            </TemplateBox>
            {isToday && !isLocked && (
                <TemplateBox style={styles.todayPill}>
                    <TemplateText size={10} color={WHITE} medium>
                        {t('courses.weekItem.today')}
                    </TemplateText>
                </TemplateBox>
            )}
        </TemplateBox>
    );
};

WeekOverviewItem.propTypes = {
    day: PropTypes.shape({
        day: PropTypes.number,
        title: PropTypes.string,
    }).isRequired,
    isCompleted: PropTypes.bool.isRequired,
    isToday: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    completedTasksCount: PropTypes.number.isRequired,
    totalTasksCount: PropTypes.number.isRequired,
};

export default WeekOverviewItem;

const styles = StyleSheet.create({
    weekCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    weekCardMuted: {
        backgroundColor: SLATE_50,
        borderColor: GRAY_200,
    },
    weekCardActive: {
        backgroundColor: INDIGO_50,
        borderColor: INDIGO_200,
    },
    weekCardLocked: {
        backgroundColor: GRAY_50,
        borderColor: GRAY_200,
        opacity: 0.6,
    },
    weekIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    weekIconSuccess: {
        backgroundColor: EMERALD_100,
    },
    weekIconActive: {
        backgroundColor: INDIGO_600,
    },
    weekIconLocked: {
        backgroundColor: GRAY_200,
    },
    weekContent: {
        flex: 1,
    },
    todayPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: INDIGO_600,
    },
    textSecondary: {
        color: ZINC_700,
    },
    textMuted: {
        color: ZINC_500,
    },
});
