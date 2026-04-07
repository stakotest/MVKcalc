type DraftLike = {
    mealType?: string | null;
    comment?: string | null;
    confidence?: number | null;
    parsedBy?: string | null;
    items: Array<{
        name: string;
        estimatedGrams?: number | null;
        isApproximate: boolean;
    }>;
};

export function renderDraftMessage(draft: DraftLike) {
    const mealTypeLine = draft.mealType ? `Прием пищи: ${draft.mealType}` : 'Прием пищи: не определен';

    const itemsText = draft.items.length
        ? draft.items
            .map((item) => {
                const grams =
                    typeof item.estimatedGrams === 'number'
                        ? ` — ${item.isApproximate ? '~' : ''}${item.estimatedGrams} г`
                        : '';
                return `• ${item.name}${grams}`;
            })
            .join('\n')
        : '• нет элементов';

    const commentText = draft.comment ? `\n\nКомментарий: ${draft.comment}` : '';

    const metaParts: string[] = [];

    if (draft.parsedBy) {
        metaParts.push(`Разбор: ${draft.parsedBy === 'AI' ? 'AI' : 'rules'}`);
    }

    if (typeof draft.confidence === 'number') {
        metaParts.push(`Уверенность: ${Math.round(draft.confidence * 100)}%`);
    }

    const metaText = metaParts.length ? `\n\n${metaParts.join(' • ')}` : '';

    return `Понял так:\n\n${mealTypeLine}\n${itemsText}${commentText}${metaText}\n\nСохранить?`;
}