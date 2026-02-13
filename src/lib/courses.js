import firestore from '@react-native-firebase/firestore';
import { getCourseSeed } from '../consts/courses/courseSeed';
import { ensureTaskHasDetails } from '../Utils/courseTaskDetails';
import { getCurrentLanguage } from '../i18n';

export const COURSES_COLLECTION = 'courses';
export const COURSE_PROGRESS_COLLECTION = 'courseProgress';

export const normalizeCourse = (data, id) => {
    const language = getCurrentLanguage();
    const releaseAt = data?.releaseAt?.toDate
        ? data.releaseAt.toDate()
        : data?.releaseAt
        ? new Date(data.releaseAt)
        : null;
    const days = (data?.days || []).map(day => ({
        ...day,
        tasks: (day?.tasks || []).map(task => ensureTaskHasDetails(task, day?.title, language)),
    }));

    return {
        id: id || data?.id,
        ...data,
        days,
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
    const batch = firestore().batch();
    let hasWrites = false;

    // Seed canonical course content in English so older app versions read predictable data.
    const courseSeed = getCourseSeed('en');

    courseSeed.forEach(course => {
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
