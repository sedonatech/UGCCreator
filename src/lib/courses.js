import firestore from '@react-native-firebase/firestore';
import { getCourseSeed } from '../consts/courses/courseSeed';

export const COURSES_COLLECTION = 'courses';
export const COURSE_PROGRESS_COLLECTION = 'courseProgress';

export const normalizeCourse = (data, id) => {
    const releaseAt = data?.releaseAt?.toDate
        ? data.releaseAt.toDate()
        : data?.releaseAt
        ? new Date(data.releaseAt)
        : null;
    return {
        id: id || data?.id,
        ...data,
        releaseAt,
    };
};

export const getDefaultCourseProgress = (course, isLocked) => ({
    courseId: course?.id,
    currentDay: isLocked ? 0 : 1,
    completedDays: [],
    completedTasks: {},
    streak: 0,
    lastCompletedAt: null,
});

export const ensureCoursesSeeded = async ({ isAdmin, allowDev = false } = {}) => {
    if (!isAdmin && !allowDev) return false;
    const snapshot = await firestore().collection(COURSES_COLLECTION).get();
    const existingIds = new Set(snapshot.docs.map(doc => doc.id));
    const batch = firestore().batch();
    let hasWrites = false;

    // Get course seed data for the current user's language
    const courseSeed = getCourseSeed();

    courseSeed.forEach(course => {
        if (existingIds.has(course.id)) return;
        const ref = firestore().collection(COURSES_COLLECTION).doc(course.id);
        const payload = {
            ...course,
            releaseAt: course.releaseAt ? firestore.Timestamp.fromDate(course.releaseAt) : null,
        };
        batch.set(ref, payload, { merge: true });
        hasWrites = true;
    });

    if (hasWrites) {
        await batch.commit();
    }
    return hasWrites;
};
