import { Context } from 'telegraf';
import { getUserChatState } from '../../services/chatStateService';
import {
    appendItemsToActiveDraft,
    createMealDraft,
    getActiveDraft,
    replaceActiveDraftItems,
} from '../../services/draftService';
import { parseMealDraftByRules } from '../../services/ruleMealDraftParser';
import { parseMealDraftByAI } from '../../services/aiMealParserService';
import { editDraftByAI } from '../../services/aiDraftEditorService';
import { isFoodLikeMessage } from '../../utils/isFoodLikeMessage';
import { renderDraftMessage } from '../../utils/renderDraft';
import { draftKeyboard } from '../keyboards/draftKeyboard';
import { shouldUseAiParser } from '../../utils/shouldUseAiParser';
import { isDraftEditLikeMessage } from '../../utils/isDraftEditLikeMessage';
import { handleMenuText } from './menuHandler';

const CONFIRM_WORDS = ['да', 'сохранить', 'ок', 'окей', 'yes', 'save'];
const CANCEL_WORDS = ['нет', 'отмена', 'cancel', 'stop'];

async function parseIncomingMealText(text: string) {
    const wantsAi = shouldUseAiParser(text);

    if (!wantsAi) {
        const parsed = parseMealDraftByRules(text);
        return {
            parsed,
            parserUsed: 'RULES' as const,
            fallbackMessage: null as string | null,
        };
    }

    const aiResult = await parseMealDraftByAI(text);

    if (aiResult.ok) {
        return {
            parsed: aiResult.data,
            parserUsed: 'AI' as const,
            fallbackMessage: null as string | null,
        };
    }

    const fallbackParsed = parseMealDraftByRules(text);

    if (fallbackParsed) {
        let fallbackMessage: string | null = null;

        if (aiResult.reason === 'INSUFFICIENT_QUOTA') {
            fallbackMessage =
                'AI-разбор временно недоступен из-за лимита API. Я попробовал разобрать сообщение обычной логикой.';
        } else if (aiResult.reason === 'RATE_LIMIT') {
            fallbackMessage =
                'AI-разбор временно недоступен из-за ограничения запросов. Я попробовал разобрать сообщение обычной логикой.';
        } else {
            fallbackMessage =
                'AI-разбор сейчас не сработал, поэтому я попробовал разобрать сообщение обычной логикой.';
        }

        return {
            parsed: fallbackParsed,
            parserUsed: 'RULES_FALLBACK' as const,
            fallbackMessage,
        };
    }

    return {
        parsed: null,
        parserUsed: 'AI_FAILED' as const,
        fallbackMessage:
            aiResult.reason === 'INSUFFICIENT_QUOTA'
                ? 'AI-разбор временно недоступен из-за лимита API, и обычная логика тоже не смогла уверенно разобрать сообщение.'
                : 'Не удалось разобрать сообщение ни через AI, ни обычной логикой.',
    };
}

export async function textMessageHandler(ctx: Context) {
    if (!ctx.from || !ctx.message || !('text' in ctx.message)) {
        return;
    }

    const text = ctx.message.text.trim();

    if (!text || text.startsWith('/')) {
        return;
    }

    const handledByMenu = await handleMenuText(ctx);

    if (handledByMenu) {
        return;
    }

    const chatState = await getUserChatState(ctx.from.id);
    const normalized = text.toLowerCase();

    if (chatState?.state === 'WAITING_CONFIRMATION') {
        if (CONFIRM_WORDS.includes(normalized)) {
            await ctx.reply('Используй кнопку "Сохранить" под черновиком.');
            return;
        }

        if (CANCEL_WORDS.includes(normalized)) {
            await ctx.reply('Используй кнопку "Отмена" под черновиком.');
            return;
        }

        const activeDraft = await getActiveDraft(ctx.from.id);

        if (!activeDraft) {
            await ctx.reply('Активный черновик не найден.');
            return;
        }

        const looksLikeEdit = isDraftEditLikeMessage(text);

        if (looksLikeEdit) {
            const aiEditResult = await editDraftByAI({
                currentMealType: activeDraft.mealType,
                currentComment: activeDraft.comment,
                currentItems: activeDraft.items.map((item) => ({
                    name: item.name,
                    estimatedGrams: item.estimatedGrams,
                    isApproximate: item.isApproximate,
                    sourceType: item.sourceType,
                })),
                userMessage: text,
            });

            if (aiEditResult.ok) {
                const updatedDraft = await replaceActiveDraftItems({
                    telegramId: ctx.from.id,
                    items: aiEditResult.data.items,
                    comment: aiEditResult.data.comment ?? 'Черновик обновлен после правки.',
                });

                if (!updatedDraft) {
                    await ctx.reply('Не удалось обновить черновик.');
                    return;
                }

                await ctx.reply(renderDraftMessage(updatedDraft), draftKeyboard());
                return;
            }

            await ctx.reply(
                'Не смог корректно применить правку к черновику. Попробуй написать конкретнее, например: "убери морковь", "добавь салат 100 г", "не 300, а 450".'
            );
            await ctx.reply(renderDraftMessage(activeDraft), draftKeyboard());
            return;
        }

        const parsed = parseMealDraftByRules(text);

        if (!parsed) {
            await ctx.reply(
                'Не смог понять, что добавить в черновик. Попробуй написать проще, например: "яблоко 150 г".'
            );
            await ctx.reply(renderDraftMessage(activeDraft), draftKeyboard());
            return;
        }

        const updatedDraft = await appendItemsToActiveDraft({
            telegramId: ctx.from.id,
            items: parsed.items,
            comment: 'Черновик дополнен новым сообщением.',
        });

        if (!updatedDraft) {
            await ctx.reply('Не удалось обновить черновик.');
            return;
        }

        await ctx.reply(renderDraftMessage(updatedDraft), draftKeyboard());
        return;
    }

    if (!isFoodLikeMessage(text)) {
        return;
    }

    const parseResult = await parseIncomingMealText(text);

    if (!parseResult.parsed) {
        if (parseResult.fallbackMessage) {
            await ctx.reply(parseResult.fallbackMessage);
        }

        await ctx.reply(
            'Пока не смог понять это как прием пищи. Попробуй написать, например: "банан 120 г" или "на обед был плов примерно 300 г".'
        );
        return;
    }

    const draft = await createMealDraft({
        telegramId: ctx.from.id,
        sourceText: text,
        mealType: parseResult.parsed.mealType,
        parsedBy: parseResult.parsed.parsedBy,
        confidence: parseResult.parsed.confidence,
        comment: parseResult.parsed.comment,
        items: parseResult.parsed.items,
    });

    if (parseResult.fallbackMessage) {
        await ctx.reply(parseResult.fallbackMessage);
    }

    await ctx.reply(renderDraftMessage(draft), draftKeyboard());
}