import { getCourseSeed } from '../consts/courses/courseSeed';
import { ensureTaskHasDetails } from '../Utils/courseTaskDetails';

const mergeTranslatedTasks = (translatedDay, sourceDay, language) => {
    const translatedTasks = translatedDay?.tasks || [];
    const sourceTasks = sourceDay?.tasks || [];
    const taskCount = Math.max(translatedTasks.length, sourceTasks.length);
    const shouldReuseSourceDetails = (language || 'en').toLowerCase().startsWith('en');

    return Array.from({ length: taskCount }).map((_, index) => {
        const translatedTask = translatedTasks[index] || {};
        const sourceTask = sourceTasks[index] || {};
        return ensureTaskHasDetails(
            {
                ...sourceTask,
                ...translatedTask,
                details: translatedTask?.details || (shouldReuseSourceDetails ? sourceTask?.details : undefined),
            },
            translatedDay?.title || sourceDay?.title,
            language,
        );
    });
};

const mergeTranslatedDays = (translatedDays, sourceDays, language) => {
    const source = sourceDays || [];
    const translated = translatedDays || [];
    const dayCount = Math.max(translated.length, source.length);

    return Array.from({ length: dayCount }).map((_, index) => {
        const translatedDay = translated[index] || source[index] || {};
        const sourceDay = source.find(day => day.day === translatedDay?.day) || source[index] || {};

        return {
            ...sourceDay,
            ...translatedDay,
            tasks: mergeTranslatedTasks(translatedDay, sourceDay, language),
        };
    });
};

/**
 * Translates a course object to the current language
 * @param {Object} course - Course object from Firestore
 * @param {string} language - Target language code (e.g., 'en', 'es', 'fr')
 * @returns {Object} Translated course object
 */
export const translateCourse = (course, language = 'en') => {
    if (!course?.id) return course;

    // Get the course seed for the target language
    const courseSeed = getCourseSeed(language);

    // Find the matching course template by ID
    const courseTemplate = courseSeed.find(c => c.id === course.id);

    if (!courseTemplate) {
        // If no template found, return original course
        return course;
    }

    // Merge translated content while preserving computed task details
    return {
        ...course,
        title: courseTemplate.title,
        subtitle: courseTemplate.subtitle,
        shortDescription: courseTemplate.shortDescription,
        description: courseTemplate.description,
        days: mergeTranslatedDays(courseTemplate.days, course.days, language),
    };
};

/**
 * Translates an array of courses to the current language
 * @param {Array} courses - Array of course objects from Firestore
 * @param {string} language - Target language code
 * @returns {Array} Array of translated course objects
 */
export const translateCourses = (courses, language = 'en') => {
    if (!Array.isArray(courses)) return courses;
    return courses.map(course => translateCourse(course, language));
};

/**
 * Get a specific day's content in the current language
 * @param {string} courseId - Course ID
 * @param {number} dayNumber - Day number (1-30)
 * @param {string} language - Target language code
 * @returns {Object|null} Translated day object
 */
export const getTranslatedDay = (courseId, dayNumber, language = 'en') => {
    const courseSeed = getCourseSeed(language);
    const courseTemplate = courseSeed.find(c => c.id === courseId);

    if (!courseTemplate?.days) return null;

    return courseTemplate.days.find(day => day.day === dayNumber) || null;
};
