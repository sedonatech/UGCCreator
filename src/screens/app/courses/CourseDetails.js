/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { USERS_COLLECTION } from '../../../hooks/user/useProfile';
import {
    COURSES_COLLECTION,
    COURSE_PROGRESS_COLLECTION,
    getDefaultCourseProgress,
    normalizeCourse,
} from '../../../lib/courses';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import CourseHeroHeader from './components/CourseHeroHeader';
import CourseDetailsCard from './components/CourseDetailsCard';
import CourseProgressCard from './components/CourseProgressCard';
import TaskCard from './components/TaskCard';
import ProTipCard from './components/ProTipCard';
import WeekOverviewItem from './components/WeekOverviewItem';
import LockedCourseMessage from './components/LockedCourseMessage';
import { WHITE, ZINC_900, ZINC_500, GRAY_100 } from '../../../theme/Colors';
import useTranslation from '../../../hooks/useTranslation';

const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const CourseDetails = ({ route }) => {
    const { auth } = useAuthContext();
    const userId = auth?.user?.uid;
    const { trackEvent } = useTrackEvent();
    const { t } = useTranslation();
    const trackedCourseRef = useRef(null);

    const courseId = route?.params?.courseId;
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return null;
        let unsubscribe;
        const loadCourse = async () => {
            try {
                unsubscribe = firestore()
                    .collection(COURSES_COLLECTION)
                    .doc(courseId)
                    .onSnapshot(snapshot => {
                        if (!snapshot.exists) {
                            setCourse(null);
                            setLoading(false);
                            return;
                        }
                        setCourse(normalizeCourse(snapshot.data(), snapshot.id));
                        setLoading(false);
                    });
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };
        loadCourse();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [courseId]);

    useEffect(() => {
        if (!userId || !courseId) return null;
        const progressRef = firestore()
            .collection(USERS_COLLECTION)
            .doc(userId)
            .collection(COURSE_PROGRESS_COLLECTION)
            .doc(courseId);
        const unsubscribe = progressRef.onSnapshot(snapshot => {
            if (snapshot.exists) {
                setProgress(snapshot.data());
            }
        });
        return () => unsubscribe();
    }, [courseId, userId]);

    const isComingSoon = course?.releaseAt && course.releaseAt > new Date();
    const isLocked = isComingSoon;
    const totalDays = course?.totalDays || course?.days?.length || 0;
    const currentDayNumber = Math.max(1, Math.min(progress?.currentDay || 1, totalDays || 1));
    const currentDayData = course?.days?.find(day => day.day === currentDayNumber) || course?.days?.[0];
    const completedDays = progress?.completedDays || [];
    const completedTasks = progress?.completedTasks?.[String(currentDayNumber)] || [];
    const completionRatio = totalDays ? Math.round(((progress?.completedDays?.length || 0) / totalDays) * 100) : 0;

    const weekDays = useMemo(() => {
        if (!course?.days?.length) return [];
        const weekIndex = Math.floor((currentDayNumber - 1) / 7);
        const start = weekIndex * 7;
        return course.days.slice(start, start + 7);
    }, [course, currentDayNumber]);

    const handleToggleTask = useCallback(
        async taskIndex => {
            if (!userId || !course || isLocked || !currentDayData) return;
            const progressRef = firestore()
                .collection(USERS_COLLECTION)
                .doc(userId)
                .collection(COURSE_PROGRESS_COLLECTION)
                .doc(course.id);
            const dayKey = String(currentDayData.day);
            const existingTasks = progress?.completedTasks?.[dayKey] || [];
            const hasTask = existingTasks.includes(taskIndex);
            const nextTasks = hasTask
                ? existingTasks.filter(index => index !== taskIndex)
                : [...existingTasks, taskIndex];
            const taskCount = currentDayData.tasks.length;
            const wasComplete = existingTasks.length === taskCount;
            const isComplete = nextTasks.length === taskCount;
            const nextCompletedDays = new Set(completedDays);

            if (isComplete) {
                nextCompletedDays.add(currentDayData.day);
            } else {
                nextCompletedDays.delete(currentDayData.day);
            }

            let nextCurrentDay = progress?.currentDay || 1;
            if (!wasComplete && isComplete && currentDayData.day === nextCurrentDay && currentDayData.day < totalDays) {
                nextCurrentDay = currentDayData.day + 1;
            }

            let nextStreak = progress?.streak || 0;
            let lastCompletedAt = progress?.lastCompletedAt?.toDate
                ? progress.lastCompletedAt.toDate()
                : progress?.lastCompletedAt
                ? new Date(progress.lastCompletedAt)
                : null;

            if (!wasComplete && isComplete) {
                const today = startOfDay(new Date());
                if (!lastCompletedAt) {
                    nextStreak = 1;
                } else {
                    const lastDay = startOfDay(lastCompletedAt);
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastDay.getTime() === today.getTime()) {
                        nextStreak = Math.max(nextStreak, 1);
                    } else if (lastDay.getTime() === yesterday.getTime()) {
                        nextStreak = nextStreak + 1;
                    } else {
                        nextStreak = 1;
                    }
                }
                lastCompletedAt = new Date();
            }

            await progressRef.set(
                {
                    completedTasks: {
                        ...(progress?.completedTasks || {}),
                        [dayKey]: nextTasks,
                    },
                    completedDays: Array.from(nextCompletedDays),
                    currentDay: nextCurrentDay,
                    streak: nextStreak,
                    lastCompletedAt: lastCompletedAt ? firestore.Timestamp.fromDate(lastCompletedAt) : null,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                },
                { merge: true },
            );

            trackEvent('course_task_toggled', {
                courseId,
                courseName: course?.title,
                day: currentDayData.day,
                taskIndex,
                taskTitle: currentDayData.tasks[taskIndex]?.title,
                isCompleted: !hasTask,
            });
        },
        [completedDays, course, courseId, currentDayData, isLocked, progress, totalDays, trackEvent, userId],
    );

    const handleResetCourse = useCallback(() => {
        if (!userId || !courseId || !course) return;
        Alert.alert(t('courses.details.restartAlert.title'), t('courses.details.restartAlert.message'), [
            { text: t('courses.details.restartAlert.cancel'), style: 'cancel' },
            {
                text: t('courses.details.restartAlert.restart'),
                style: 'destructive',
                onPress: async () => {
                    const progressRef = firestore()
                        .collection(USERS_COLLECTION)
                        .doc(userId)
                        .collection(COURSE_PROGRESS_COLLECTION)
                        .doc(courseId);
                    const resetProgress = getDefaultCourseProgress(course, false);
                    await progressRef.set(resetProgress, { merge: true });
                    trackEvent('course_restarted', {
                        courseId,
                        courseName: course?.title,
                    });
                },
            },
        ]);
    }, [course, courseId, userId, t, trackEvent]);

    useEffect(() => {
        if (!course?.id) return;
        if (trackedCourseRef.current === course.id) return;
        trackedCourseRef.current = course.id;
        trackEvent('course_screen_viewed', {
            courseId: course.id,
            courseName: course?.title,
        });
    }, [course?.id, course?.title]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <CourseHeroHeader course={course} totalDays={totalDays} onReset={handleResetCourse} />

            <CourseDetailsCard course={course} totalDays={totalDays} />

            <TemplateBox style={styles.section}>
                <CourseProgressCard
                    progress={progress}
                    currentDayNumber={currentDayNumber}
                    totalDays={totalDays}
                    completionRatio={completionRatio}
                />
            </TemplateBox>

            <TemplateBox style={styles.section}>
                <TemplateBox row alignItems="center" justifyContent="space-between" mb={12}>
                    <TemplateText size={14} semiBold color={styles.textPrimary.color}>
                        {t('courses.details.todaysChecklist')}
                    </TemplateText>
                    <TemplateBox style={styles.dayPill}>
                        <TemplateText size={11} color={styles.textMuted.color}>
                            {t('courses.details.dayPrefix')} {currentDayNumber}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>

                {isLocked && <LockedCourseMessage isComingSoon={isComingSoon} />}

                {!isLocked &&
                    currentDayData?.tasks?.map((task, index) => {
                        const isComplete = completedTasks.includes(index);
                        return (
                            <TaskCard
                                key={`${currentDayData.day}-${index}`}
                                task={task}
                                index={index}
                                isComplete={isComplete}
                                onToggle={handleToggleTask}
                                dayNumber={currentDayData.day}
                                disabled={loading}
                            />
                        );
                    })}

                <ProTipCard tip={currentDayData?.tip} />
            </TemplateBox>

            <TemplateBox style={styles.section}>
                <TemplateText size={14} semiBold color={styles.textPrimary.color} mb={12}>
                    {currentDayData?.weekTitle || t('courses.details.weekOverview')}
                </TemplateText>

                {weekDays.map(day => {
                    const isCompleted = completedDays.includes(day.day);
                    const isToday = day.day === currentDayNumber;
                    const isLockedDay = day.day > currentDayNumber;
                    const completedTasksCount = progress?.completedTasks?.[String(day.day)]?.length || 0;
                    const totalTasksCount = day.tasks.length;

                    return (
                        <WeekOverviewItem
                            key={day.day}
                            day={day}
                            isCompleted={isCompleted}
                            isToday={isToday}
                            isLocked={isLockedDay}
                            completedTasksCount={completedTasksCount}
                            totalTasksCount={totalTasksCount}
                        />
                    );
                })}
            </TemplateBox>
        </ScrollView>
    );
};

export default CourseDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    dayPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: GRAY_100,
    },
    textPrimary: {
        color: ZINC_900,
    },
    textMuted: {
        color: ZINC_500,
    },
});
