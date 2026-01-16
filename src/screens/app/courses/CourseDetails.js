import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { USERS_COLLECTION } from '../../../hooks/user/useProfile';
import {
    COURSES_COLLECTION,
    COURSE_PROGRESS_COLLECTION,
    getDefaultCourseProgress,
    normalizeCourse,
} from '../../../lib/courses';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const CourseDetails = ({ route }) => {
    const { auth } = useAuthContext();
    const userId = auth?.user?.uid;
    const { trackEvent } = useTrackEvent();
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
        Alert.alert('Restart course?', 'This will clear your progress and start the course from the beginning.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Restart',
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
    }, [course, courseId, userId]);

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
            <TemplateBox style={styles.hero}>
                <LinearGradient
                    colors={course?.gradient || ['#4F46E5', '#7C3AED', '#EC4899']}
                    style={styles.heroGradient}
                />
                <TemplateBox style={styles.heroOverlay} />
                <TemplateBox style={styles.resetButton} onPress={handleResetCourse} center>
                    <TemplateIcon name="refresh" size={14} color="#FFFFFF" />
                    <TemplateText size={11} color="#FFFFFF" ml={6} medium>
                        Reset
                    </TemplateText>
                </TemplateBox>
                <TemplateBox style={styles.heroPill}>
                    <TemplateText size={12} medium color="#FFFFFF">
                        {totalDays || 30}-Day Program
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox style={styles.detailsCard}>
                <TemplateText size={20} semiBold color={styles.textPrimary.color} mb={8}>
                    {course?.title || 'Course'}
                </TemplateText>
                <TemplateText size={13} color={styles.textMuted.color} lineHeight={20} mb={12}>
                    {course?.description || 'Course details are loading.'}
                </TemplateText>
                <TemplateBox row alignItems="center" style={styles.metaRow}>
                    <TemplateBox row alignItems="center" mr={16}>
                        <TemplateIcon name="time-outline" size={14} color={styles.textMuted.color} />
                        <TemplateText size={12} color={styles.textMuted.color} ml={6}>
                            {totalDays || 0} days
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox row alignItems="center" mr={16}>
                        <TemplateIcon name="checkmark-circle-outline" size={14} color={styles.textMuted.color} />
                        <TemplateText size={12} color={styles.textMuted.color} ml={6}>
                            {(course?.days?.length || 0) * 4} tasks
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox row alignItems="center">
                        <TemplateIcon name="trophy-outline" size={14} color="#F59E0B" />
                        <TemplateText size={12} color={styles.textMuted.color} ml={6}>
                            Certificate
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox style={styles.section}>
                <TemplateBox style={styles.progressCard}>
                    <TemplateBox row alignItems="center" justifyContent="space-between" mb={10}>
                        <TemplateText size={12} medium color={styles.textMuted.color}>
                            Your Progress
                        </TemplateText>
                        <TemplateText size={12} semiBold color="#4338CA">
                            Day {currentDayNumber} of {totalDays || 0}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox style={styles.progressTrack}>
                        <LinearGradient
                            colors={['#4F46E5', '#7C3AED']}
                            style={[styles.progressFill, { width: `${completionRatio}%` }]}
                        />
                    </TemplateBox>
                    <TemplateBox row alignItems="center" justifyContent="space-between" mt={8}>
                        <TemplateText size={11} color={styles.textMuted.color}>
                            {progress?.completedDays?.length || 0} days completed
                        </TemplateText>
                        <TemplateText size={11} color={styles.textMuted.color}>
                            {(totalDays || 0) - (progress?.completedDays?.length || 0)} days remaining
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox style={styles.section}>
                <TemplateBox row alignItems="center" justifyContent="space-between" mb={12}>
                    <TemplateText size={14} semiBold color={styles.textPrimary.color}>
                        Today&apos;s Checklist
                    </TemplateText>
                    <TemplateBox style={styles.dayPill}>
                        <TemplateText size={11} color={styles.textMuted.color}>
                            Day {currentDayNumber}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>

                {isLocked && (
                    <TemplateBox style={styles.lockedCard}>
                        <TemplateIcon name="lock-closed" size={18} color="#9CA3AF" />
                        <TemplateText size={13} color={styles.textMuted.color} ml={10}>
                            {isComingSoon
                                ? 'This course unlocks next month.'
                                : 'Upgrade to premium to access this course.'}
                        </TemplateText>
                    </TemplateBox>
                )}

                {!isLocked &&
                    currentDayData?.tasks?.map((task, index) => {
                        const isComplete = completedTasks.includes(index);
                        const tagStyle = TAG_STYLES[task.tag] || styles.tagIndigo;
                        const tagTextColor = TAG_TEXT_COLORS[task.tag] || '#4338CA';
                        return (
                            <TemplateBox
                                key={`${currentDayData.day}-${index}`}
                                style={styles.taskCard}
                                onPress={() => handleToggleTask(index)}
                                disabled={loading}
                            >
                                <TemplateBox style={isComplete ? styles.checkBox : styles.uncheckedBox}>
                                    {isComplete && <TemplateIcon name="checkmark" size={12} color="#FFFFFF" />}
                                </TemplateBox>
                                <TemplateBox style={styles.taskContent}>
                                    <TemplateText size={14} medium color={styles.textPrimary.color} mb={4}>
                                        {task.title}
                                    </TemplateText>
                                    <TemplateText size={12} color={styles.textMuted.color} lineHeight={18}>
                                        {task.description}
                                    </TemplateText>
                                    <TemplateBox row alignItems="center" mt={8}>
                                        <TemplateBox style={[styles.tagPill, tagStyle]}>
                                            <TemplateText size={10} color={tagTextColor}>
                                                {task.tag}
                                            </TemplateText>
                                        </TemplateBox>
                                        <TemplateText size={11} color={styles.textMuted.color} ml={8}>
                                            ~{task.durationMinutes} min
                                        </TemplateText>
                                    </TemplateBox>
                                </TemplateBox>
                            </TemplateBox>
                        );
                    })}

                {!!currentDayData?.tip && (
                    <TemplateBox style={styles.tipCard} overflow="hidden">
                        <LinearGradient colors={['#EEF2FF', '#F5F3FF']} style={styles.gradientTipCard} />
                        <TemplateBox style={styles.tipIcon}>
                            <TemplateIcon name="bulb" size={14} color="#4F46E5" />
                        </TemplateBox>
                        <TemplateBox style={styles.tipContent}>
                            <TemplateText size={12} medium color="#4338CA" mb={4}>
                                Pro Tip of the Day
                            </TemplateText>
                            <TemplateBox width="80%">
                                <TemplateText size={12} color={styles.textMuted.color} lineHeight={18}>
                                    {currentDayData.tip}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    </TemplateBox>
                )}
            </TemplateBox>

            <TemplateBox style={styles.section}>
                <TemplateText size={14} semiBold color={styles.textPrimary.color} mb={12}>
                    {currentDayData?.weekTitle || 'Week Overview'}
                </TemplateText>

                {weekDays.map(day => {
                    const isCompleted = completedDays.includes(day.day);
                    const isToday = day.day === currentDayNumber;
                    const isLockedDay = day.day > currentDayNumber;
                    return (
                        <TemplateBox
                            key={day.day}
                            style={[
                                styles.weekCard,
                                isLockedDay
                                    ? styles.weekCardLocked
                                    : isToday
                                    ? styles.weekCardActive
                                    : styles.weekCardMuted,
                            ]}
                        >
                            <TemplateBox
                                style={[
                                    styles.weekIcon,
                                    isLockedDay
                                        ? styles.weekIconLocked
                                        : isToday
                                        ? styles.weekIconActive
                                        : styles.weekIconSuccess,
                                ]}
                            >
                                {isLockedDay && <TemplateIcon name="lock-closed" size={12} color="#9CA3AF" />}
                                {isCompleted && !isLockedDay && (
                                    <TemplateIcon name="checkmark" size={12} color="#10B981" />
                                )}
                                {isToday && !isCompleted && (
                                    <TemplateText size={10} color="#FFFFFF" semiBold>
                                        {day.day}
                                    </TemplateText>
                                )}
                            </TemplateBox>
                            <TemplateBox style={styles.weekContent}>
                                <TemplateText
                                    size={13}
                                    medium
                                    color={isLockedDay ? '#6B7280' : styles.textSecondary.color}
                                >
                                    Day {day.day}: {day.title}
                                </TemplateText>
                                <TemplateText size={11} color={isLockedDay ? '#9CA3AF' : styles.textMuted.color}>
                                    {isLockedDay
                                        ? 'Locked'
                                        : `${(progress?.completedTasks?.[String(day.day)] || []).length}/${
                                              day.tasks.length
                                          } tasks completed`}
                                </TemplateText>
                            </TemplateBox>
                            {isToday && !isLockedDay && (
                                <TemplateBox style={styles.todayPill}>
                                    <TemplateText size={10} color="#FFFFFF" medium>
                                        Today
                                    </TemplateText>
                                </TemplateBox>
                            )}
                        </TemplateBox>
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
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    hero: {
        height: 160,
        position: 'relative',
    },
    heroGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    heroOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    heroPill: {
        position: 'absolute',
        left: 24,
        bottom: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    resetButton: {
        position: 'absolute',
        right: 20,
        top: 65,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
    },
    detailsCard: {
        marginHorizontal: 24,
        marginTop: -24,
        borderRadius: 20,
        padding: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#111827',
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    metaRow: {
        flexWrap: 'wrap',
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    progressCard: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    progressTrack: {
        height: 6,
        borderRadius: 999,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
    },
    progressFill: {
        width: '10%',
        height: '100%',
        borderRadius: 999,
    },
    dayPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#F3F4F6',
    },
    taskCard: {
        flexDirection: 'row',
        gap: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    uncheckedBox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginTop: 2,
    },
    taskContent: {
        flex: 1,
    },
    tagPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
    },
    tagIndigo: {
        backgroundColor: '#E0E7FF',
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    tagEmerald: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    tagAmber: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    tagPink: {
        backgroundColor: '#FCE7F3',
        borderWidth: 1,
        borderColor: '#FBCFE8',
    },
    tipCard: {
        marginTop: 6,
        padding: 14,
        borderRadius: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E0E7FF',
    },
    gradientTipCard: {
        ...StyleSheet.absoluteFill,
    },
    tipIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#E0E7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    tipContent: {
        flex: 1,
    },
    lockedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        marginBottom: 12,
    },
    weekCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    weekCardMuted: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E5E7EB',
    },
    weekCardActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#C7D2FE',
    },
    weekCardLocked: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
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
        backgroundColor: '#D1FAE5',
    },
    weekIconActive: {
        backgroundColor: '#4F46E5',
    },
    weekIconLocked: {
        backgroundColor: '#E5E7EB',
    },
    weekContent: {
        flex: 1,
    },
    todayPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#4F46E5',
    },
    textPrimary: {
        color: '#111827',
    },
    textSecondary: {
        color: '#1F2937',
    },
    textMuted: {
        color: '#4B5563',
    },
});

const TAG_STYLES = {
    Learn: styles.tagIndigo,
    Action: styles.tagPink,
    Build: styles.tagEmerald,
    Review: styles.tagAmber,
};

const TAG_TEXT_COLORS = {
    Learn: '#4338CA',
    Action: '#DB2777',
    Build: '#059669',
    Review: '#D97706',
};
