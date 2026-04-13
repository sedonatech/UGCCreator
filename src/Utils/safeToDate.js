/**
 * Safely converts a Firestore Timestamp, ISO string, epoch number, or Date to a JS Date.
 * Returns null if the value cannot be converted.
 *
 * Handles data from both mobile (Firestore Timestamps) and web (ISO strings).
 */
const safeToDate = value => {
    if (!value) return null;

    // Already a Date
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    // Firestore Timestamp (.toDate method)
    if (typeof value?.toDate === 'function') {
        try {
            const d = value.toDate();
            return Number.isNaN(d.getTime()) ? null : d;
        } catch {
            return null;
        }
    }

    // Serialised Firestore Timestamp ({ seconds, nanoseconds })
    if (typeof value?.seconds === 'number') {
        const d = new Date(value.seconds * 1000);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    // Stripped Firestore Timestamp (getters lost via React Navigation params)
    if (typeof value?._seconds === 'number') {
        const d = new Date(value._seconds * 1000);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    // Epoch milliseconds
    if (typeof value === 'number') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    // ISO string or other parseable string
    if (typeof value === 'string') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    return null;
};

export default safeToDate;
