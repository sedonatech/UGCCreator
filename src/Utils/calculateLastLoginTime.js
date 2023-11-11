import moment from 'moment';


export default (lastLoginTime) => {
    if (!lastLoginTime) {
        return '';
    }

    const lastLogin = moment(lastLoginTime);
    const now = moment(new Date());

    const weeks = now.diff(lastLogin, 'weeks')
    if (weeks > 0) {
        const unit = weeks > 1 ? 'weeks' : 'week'
        return `${weeks} ${unit} ago`
    }

    const days = now.diff(lastLogin, 'days')
    if (days > 0) {
        const unit = days > 1 ? 'days' : 'day'
        return `${days} ${unit} ago`
    }

    const hours = now.diff(lastLogin, 'hours')
    if (hours > 0) {
        const unit = hours > 1 ? 'hours' : 'hour'
        return `${hours} ${unit} ago`
    }

    const minutes = now.diff(lastLogin, 'minutes')
    if (minutes > 0) {
        const unit = minutes > 1 ? 'minutes' : 'minute'
        return `${minutes} ${unit} ago`
    }

    const seconds = now.diff(lastLogin, 'seconds')
    if (seconds > 0) {
        const unit = seconds > 1 ? 'seconds' : 'second'
        return `${seconds} ${unit} ago`
    }

    const milliseconds = now.diff(lastLogin, 'milliseconds')
    if (milliseconds > 0) {
        return `few seconds ago`
    }

    return (parseInt(Math.floor(num / 5)) * 5);
};

