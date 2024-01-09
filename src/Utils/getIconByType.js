const getIconByType = (type) => {
    if (type === 'ideas') {
        return 'trending-up-outline';
    } if (type === 'tips') {
        return 'rocket-outline';
    } if (type === 'videoLessons') {
        return 'videocam-outline';
    } if (type === 'hooks') {
        return 'reader-outline';
    } if (type === 'photoEditing') {
        return 'camera-outline';
    } if (type === 'ctaTips') {
        return 'bar-chart-outline';
    }
    return 'article';
};

export default getIconByType;
