export function resolveMealTypeFromCurrentTime(date = new Date()): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 5 * 60 && totalMinutes < 11 * 60) {
        return 'Завтрак';
    }

    if (totalMinutes >= 11 * 60 && totalMinutes < 17 * 60) {
        return 'Обед';
    }

    if (totalMinutes >= 17 * 60 && totalMinutes < 23 * 60 + 30) {
        return 'Ужин';
    }

    return 'Поздний прием пищи';
}