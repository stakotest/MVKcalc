import { Context } from 'telegraf';
import {
    cancelActiveDraft,
    confirmActiveDraft,
    getActiveDraft,
} from '../../services/draftService';
import { renderDraftMessage } from '../../utils/renderDraft';
import { draftKeyboard } from '../keyboards/draftKeyboard';

function getItemStatus(item: {
    linkedFoodId?: string | null;
    caloriesKcal?: number | null;
    nutrientSnapshots?: Array<unknown>;
}) {
    const hasLinkedFood = Boolean(item.linkedFoodId);
    const hasCalories = typeof item.caloriesKcal === 'number';
    const hasSnapshots = Array.isArray(item.nutrientSnapshots) && item.nutrientSnapshots.length > 0;

    if (hasLinkedFood && hasCalories && hasSnapshots) {
        return '[калории и нутриенты учтены]';
    }

    if (hasLinkedFood && (hasCalories || hasSnapshots)) {
        return '[учтено частично]';
    }

    if (hasLinkedFood) {
        return '[найден продукт, но нутриенты не посчитаны]';
    }

    return '[не найдено в базе]';
}

export async function handleDraftConfirm(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    if ('answerCbQuery' in ctx) {
        try {
            await ctx.answerCbQuery();
        } catch {}
    }

    const result = await confirmActiveDraft(ctx.from.id);

    if (!result) {
        await ctx.reply('Активный черновик не найден.');
        return;
    }

    const mealItems = result.meal?.items ?? [];
    const itemsText = mealItems.length
        ? mealItems
            .map((item) => {
                const amount =
                    item.amountValue && item.amountUnit
                        ? ` — ${item.isApproximate ? '~' : ''}${item.amountValue} ${item.amountUnit}`
                        : '';

                const status = getItemStatus(item);

                return `• ${item.productName}${amount} ${status}`;
            })
            .join('\n')
        : '• нет элементов';

    await ctx.reply(
        [
            'Сохранено ✅',
            '',
            `Прием пищи: ${result.draft.mealType ?? 'Не определен'}`,
            itemsText,
        ].join('\n')
    );
}

export async function handleDraftCancel(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    if ('answerCbQuery' in ctx) {
        try {
            await ctx.answerCbQuery();
        } catch {}
    }

    const cancelledDraft = await cancelActiveDraft(ctx.from.id);

    if (!cancelledDraft) {
        await ctx.reply('Активный черновик не найден.');
        return;
    }

    await ctx.reply('Черновик отменен ❌');
}

export async function handleShowActiveDraft(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    const draft = await getActiveDraft(ctx.from.id);

    if (!draft) {
        await ctx.reply('Сейчас нет активного черновика.');
        return;
    }

    await ctx.reply(renderDraftMessage(draft), draftKeyboard());
}