export default function timeSince(number: number) {
    var seconds = Math.floor((new Date().getTime() - new Date(number).getTime()) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
        const years = Math.floor(interval);
        return years + (years == 1 ? ' year' : ' years');
    }

    interval = seconds / 2592000;

    if (interval > 1) {
        const months = Math.floor(interval);
        return months + (months == 1 ? ' month' : ' months');
    }

    interval = seconds / 86400;

    if (interval > 1) {
        const days = Math.floor(interval);
        return days + (days == 1 ? ' day' : ' days');
    }

    interval = seconds / 3600;

    if (interval > 1) {
        const hours = Math.floor(interval);
        return hours + (hours == 1 ? ' hour' : ' hours');
    }

    interval = seconds / 60;

    if (interval > 1) {
        const minutes = Math.floor(interval);
        return minutes + (minutes == 1 ? ' minute' : ' minutes');
    }

    const s = Math.floor(interval);
    return s + (s == 1 ? ' second' : ' seconds');
}
