export const getCapitalizedFirstLetter = (value: string): string => {
    if (!value) {
        return '';
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }

    return trimmed.charAt(0).toUpperCase();
};
