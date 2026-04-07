export function isFoodLikeMessage(text: string): boolean {
    const normalized = text.trim().toLowerCase();

    if (!normalized) {
        return false;
    }

    const nonFoodCommands = [
        '/start',
        '/profile',
        '/today',
        '/day_report',
        '/week_report',
        '/month_report',
    ];

    if (nonFoodCommands.includes(normalized)) {
        return false;
    }

    const reportKeywords = [
        'отчет',
        'покажи отчет',
        'покажи за сегодня',
        'покажи сегодня',
        'покажи неделю',
        'покажи месяц',
        'статистика',
        'дефицит',
        'что я ел',
    ];

    if (reportKeywords.some((word) => normalized.includes(word))) {
        return false;
    }

    return true;
}