export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

export function getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}

export function getStartOfNDaysAgo(days: number): Date {
    const now = new Date();
    const result = new Date(now);
    result.setDate(now.getDate() - days);
    result.setHours(0, 0, 0, 0);
    return result;
}

export function getDateRangeLabel(start: Date, end: Date): string {
    return `${formatDate(start)} - ${formatDate(end)}`;
}