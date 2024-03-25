import formatDistance from 'date-fns/formatDistance';

export default (lastLoginTime) => {
    if (!lastLoginTime) {
        return '';
    }

    return formatDistance(new Date(lastLoginTime), new Date(), { addSuffix: true });
};
