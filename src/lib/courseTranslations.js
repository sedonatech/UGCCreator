import { getCourseSeed } from '../consts/courses/courseSeed';

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

    // Merge the translated content with the original course data
    return {
        ...course,
        title: courseTemplate.title,
        subtitle: courseTemplate.subtitle,
        shortDescription: courseTemplate.shortDescription,
        description: courseTemplate.description,
        days: courseTemplate.days,
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
