export function isDraftEditLikeMessage(text: string): boolean {
    const normalized = text.trim().toLowerCase();

    if (!normalized) {
        return false;
    }

    const editKeywords = [
        'убери',
        'удали',
        'исключи',
        'без',
        'замени',
        'вместо',
        'добавь',
        'еще',
        'ещё',
        'не ',
        'не,',
        'не  ',
        'не было',
        'там была',
        'там был',
        'там были',
        'не 300',
        'не 200',
        'не 100',
        'больше',
        'меньше',
    ];

    return editKeywords.some((word) => normalized.includes(word));
}