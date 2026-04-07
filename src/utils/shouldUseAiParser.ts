export function shouldUseAiParser(text: string): boolean {
    const normalized = text.trim().toLowerCase();

    if (!normalized) {
        return false;
    }

    const complexDishKeywords = [
        'плов',
        'борщ',
        'суп',
        'каша',
        'паста',
        'карбонара',
        'шаурма',
        'пицца',
        'салат',
        'омлет',
        'сэндвич',
        'бутерброд',
        'тарелка',
        'миска',
        'кусок',
        'немного',
        'примерно',
        'где-то',
        'около',
        'на завтрак',
        'на обед',
        'на ужин',
        'утром',
        'вечером',
        'съел',
        'съела',
        'ел',
        'ела',
        'было',
        'была',
        'были',
    ];

    if (complexDishKeywords.some((word) => normalized.includes(word))) {
        return true;
    }

    if (normalized.split(/\s+/).length >= 5) {
        return true;
    }

    return false;
}