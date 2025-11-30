export const isNonEmpty = (value: string) => value.trim().length > 0;

export const isNumericValue = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    return /^[0-9]+$/.test(trimmed);
};
