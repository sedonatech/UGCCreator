/* eslint-disable react-native/no-unused-styles */
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
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
import CoursesSummaryHeader from './components/CoursesSummaryHeader';
import CourseListItem from './components/CourseListItem';
import SeedCoursesButton from './components/SeedCoursesButton';
import { WHITE, ZINC_900, ZINC_500 } from '../../../theme/Colors';

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
                    .onSnapshot(snapshot => {
                        const nextCourses = snapshot.docs
                            .map(doc => normalizeCourse(doc.data(), doc.id))
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
        const progressRef = firestore().collection(USERS_COLLECTION).doc(userId).collection(COURSE_PROGRESS_COLLECTION);
        const unsubscribe = progressRef.onSnapshot(snapshot => {
            const nextProgress = {};
            snapshot.docs.forEach(doc => {
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
                    courses.map(async course => {
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
        const completionRatio = totals.totalDays ? Math.round((totals.completedDays / totals.totalDays) * 100) : 0;
        return {
            courseCount: courses.length,
            completionRatio,
            streak: totals.streak,
        };
    }, [courses, progressMap]);

    const formatUnlockDate = releaseAt => {
        if (!releaseAt) return null;
        const date = new Date(releaseAt);
        return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    const handleSeedCourses = async () => {
        try {
            const didWrite = await ensureCoursesSeeded({ isAdmin, allowDev: __DEV__ });
            Alert.alert('Courses seeded', didWrite ? 'Course data is now available.' : 'Courses already exist.');
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

            <CoursesSummaryHeader summary={summary} />

            <TemplateBox style={styles.section}>
                <TemplateBox row alignItems="center" justifyContent="space-between">
                    <TemplateText size={13} semiBold color={styles.textMuted.color} style={styles.uppercase}>
                        Your Courses
                    </TemplateText>
                    {showSeedCourses && <SeedCoursesButton onPress={handleSeedCourses} />}
                </TemplateBox>
                {courses.map(course => {
                    const progress = progressMap[course.id] || {};
                    return (
                        <CourseListItem
                            key={course.id}
                            course={course}
                            progress={progress}
                            formatUnlockDate={formatUnlockDate}
                            onPress={() => navigation.navigate(COURSE_DETAILS, { courseId: course.id })}
                        />
                    );
                })}
                {!loading && courses.length === 0 && (
                    <TemplateText size={14} color={styles.textMuted.color} mt={16}>
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
        backgroundColor: WHITE,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
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
