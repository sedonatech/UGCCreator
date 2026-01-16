import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { USERS_COLLECTION } from '../../../hooks/user/useProfile';
import { months } from '../../../consts/months';
import {
    COURSES_COLLECTION,
    COURSE_PROGRESS_COLLECTION,
    ensureCoursesSeeded,
    getDefaultCourseProgress,
    normalizeCourse,
} from '../../../lib/courses';
import { COURSE_DETAILS } from '../../../navigation/ScreenNames';
import { HEADER_MARGIN } from '../../../theme/Layout';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const CoursesScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const userId = auth?.user?.uid;
    const isAdmin = !!(
        auth?.profile?.isAdmin ||
        auth?.profile?.admin ||
        auth?.profile?.role === 'admin' ||
        auth?.profile?.type === 'admin'
    );
    const [courses, setCourses] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [loading, setLoading] = useState(true);
    const showSeedCourses = __DEV__;

    useEffect(() => {
        let unsubscribe;
        const loadCourses = async () => {
            try {
                unsubscribe = firestore()
                    .collection(COURSES_COLLECTION)
                    .onSnapshot((snapshot) => {
                        const nextCourses = snapshot.docs
                            .map((doc) => normalizeCourse(doc.data(), doc.id))
                            .sort((a, b) => (a?.order || 0) - (b?.order || 0));
                        setCourses(nextCourses);
                        setLoading(false);
                    });
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };

        loadCourses();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!userId) return null;
        const progressRef = firestore()
            .collection(USERS_COLLECTION)
            .doc(userId)
            .collection(COURSE_PROGRESS_COLLECTION);
        const unsubscribe = progressRef.onSnapshot((snapshot) => {
            const nextProgress = {};
            snapshot.docs.forEach((doc) => {
                nextProgress[doc.id] = doc.data();
            });
            setProgressMap(nextProgress);
        });
        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        if (!userId || !courses.length) return;
        const ensureProgressDocs = async () => {
            try {
                await Promise.all(
                    courses.map(async (course) => {
                        const progressRef = firestore()
                            .collection(USERS_COLLECTION)
                            .doc(userId)
                            .collection(COURSE_PROGRESS_COLLECTION)
                            .doc(course.id);
                        const snapshot = await progressRef.get();
                        if (!snapshot.exists) {
                            const isComingSoon = course?.releaseAt && course.releaseAt > new Date();
                            await progressRef.set(getDefaultCourseProgress(course, isComingSoon), { merge: true });
                        }
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
        ensureProgressDocs();
    }, [courses, userId]);

    const summary = useMemo(() => {
        const totals = courses.reduce(
            (acc, course) => {
                const totalDays = course?.totalDays || course?.days?.length || 0;
                const completedDays = progressMap[course.id]?.completedDays?.length || 0;
                return {
                    totalDays: acc.totalDays + totalDays,
                    completedDays: acc.completedDays + completedDays,
                    streak: Math.max(acc.streak, progressMap[course.id]?.streak || 0),
                };
            },
            { totalDays: 0, completedDays: 0, streak: 0 },
        );
        const completionRatio = totals.totalDays
            ? Math.round((totals.completedDays / totals.totalDays) * 100)
            : 0;
        return {
            courseCount: courses.length,
            completionRatio,
            streak: totals.streak,
        };
    }, [courses, progressMap]);

    const formatUnlockDate = (releaseAt) => {
        if (!releaseAt) return null;
        const date = new Date(releaseAt);
        return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    const handleSeedCourses = async () => {
        try {
            const didWrite = await ensureCoursesSeeded({ isAdmin, allowDev: __DEV__ });
            Alert.alert(
                'Courses seeded',
                didWrite ? 'Course data is now available.' : 'Courses already exist.',
            );
        } catch (e) {
            console.log(e);
            Alert.alert('Seeding failed', 'Please check the console for details.');
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                <TemplateText size={18} startCase bold>
                    LevelUp
                </TemplateText>
            </TemplateBox>
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
                        <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.heroBadge}>
                            <TemplateIcon name="flame" size={20} color="#FFFFFF" />
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
                        colors={['#4F46E5', '#7C3AED']}
                        style={[styles.progressFill, { width: `${summary.completionRatio}%` }]}
                    />
                </TemplateBox>
                <TemplateText size={12} color={styles.textMuted.color} mt={8}>
                    {summary.completionRatio}% overall completion
                </TemplateText>
            </TemplateBox>

            <TemplateBox style={styles.section}>
                <TemplateBox row alignItems="center" justifyContent="space-between">
                    <TemplateText size={13} semiBold color={styles.textMuted.color} style={styles.uppercase}>
                        Your Courses
                    </TemplateText>
                    {showSeedCourses && (
                        <TemplateBox onPress={handleSeedCourses} style={styles.seedPill} center>
                            <TemplateText size={10} semiBold color="#4338CA">
                                Seed Courses
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
                {courses.map((course) => {
                    const progress = progressMap[course.id] || {};
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
                            key={course.id}
                            onPress={
                                isLocked
                                    ? null
                                    : () => navigation.navigate(COURSE_DETAILS, { courseId: course.id })
                            }
                            borderRadius={20}
                            overflow="hidden"
                            borderWidth={1}
                            borderColor={isLocked ? '#E5E7EB' : '#C7D2FE'}
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
                                    gradientColors={course?.gradient || ['#EEF2FF', '#FFFFFF', '#EEF2FF']}
                                    borderRadius={20}
                                />
                            )}
                            <TemplateBox pAll={18}>
                                <TemplateBox row alignItems="center" justifyContent="space-between" mb={14}>
                                    <TemplateBox style={iconStyle} center>
                                        <TemplateIcon name={course?.icon} size={20} color={isLocked ? '#71717A' : course?.accent} />
                                    </TemplateBox>
                                    <TemplateBox style={statusPillStyle} center>
                                        <TemplateText size={12} color={isLocked ? '#71717A' : '#4338CA'} medium>
                                            {statusLabel}
                                        </TemplateText>
                                    </TemplateBox>
                                </TemplateBox>

                                <TemplateText size={17} semiBold color={styles.textPrimary.color} mb={6}>
                                    {course?.title}
                                </TemplateText>
                                <TemplateText size={13} color={styles.textMuted.color} lineHeight={18} mb={14}>
                                    {course?.shortDescription}
                                </TemplateText>

                                <TemplateBox row alignItems="center" justifyContent="space-between">
                                    <TemplateBox row alignItems="center">
                                        <TemplateBox row>
                                            <TemplateBox style={[styles.avatar, styles.avatarOne]} />
                                            <TemplateBox style={[styles.avatar, styles.avatarTwo]} />
                                            <TemplateBox style={[styles.avatar, styles.avatarThree]} center>
                                                <TemplateText size={8} color="#FFFFFF" semiBold>
                                                    +2k
                                                </TemplateText>
                                            </TemplateBox>
                                        </TemplateBox>
                                        <TemplateText size={12} color={styles.textMuted.color} ml={8}>
                                            enrolled
                                        </TemplateText>
                                    </TemplateBox>
                                    <TemplateBox row alignItems="center">
                                        <TemplateText size={12} medium color={isLocked ? '#71717A' : '#4338CA'} mr={6}>
                                            {isComingSoon
                                                ? `Unlocks ${unlockLabel}`
                                                : `Day ${currentDay} of ${totalDays}`}
                                        </TemplateText>
                                        <TemplateIcon name="chevron-forward" size={16} color="#9CA3AF" />
                                    </TemplateBox>
                                </TemplateBox>
                            </TemplateBox>
                            <TemplateBox style={styles.cardProgressTrack}>
                                <TemplateBox style={[styles.cardProgressFill, { width: `${completionRatio}%` }]} />
                            </TemplateBox>
                        </TemplateBox>
                    );
                })}
                {!loading && courses.length === 0 && (
                    <TemplateText size={13} color={styles.textMuted.color} mt={16}>
                        No courses available right now.
                    </TemplateText>
                )}
            </TemplateBox>
        </ScrollView>
    );
};

export default CoursesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    hero: {
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E7',
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
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '35%',
        borderRadius: 999,
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    courseCard: {
        marginTop: 16,
        shadowColor: '#4F46E5',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(79, 70, 229, 0.16)',
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(99, 102, 241, 0.18)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.35)',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    avatarOne: {
        backgroundColor: '#CBD5F5',
    },
    avatarTwo: {
        backgroundColor: '#A5B4FC',
        marginLeft: -8,
    },
    avatarThree: {
        backgroundColor: '#818CF8',
        marginLeft: -8,
    },
    cardProgressTrack: {
        height: 4,
        backgroundColor: '#E5E7EB',
    },
    cardProgressFill: {
        height: '100%',
        width: '10%',
        backgroundColor: '#4F46E5',
    },
    comingSoonCard: {
        marginTop: 16,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F3F4F6',
        opacity: 0.6,
    },
    iconMutedWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#E5E7EB',
    },
    comingSoonPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#E5E7EB',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    uppercase: {
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    seedPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(99, 102, 241, 0.14)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.35)',
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
