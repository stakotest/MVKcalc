import { Context } from 'telegraf';
import { BUTTONS } from '../../constants/buttons';
import { getMainKeyboard } from '../keyboards/mainKeyboard';
import { getReportsKeyboard } from '../keyboards/reportsKeyboard';
import { getActionsKeyboard } from '../keyboards/actionsKeyboard';
import { deleteLastMeal } from '../../services/meal/deleteLastMeal';
import { dayReportCommand } from '../commands/dayReport';
import { weekReportCommand } from '../commands/weekReport';
import { monthReportCommand } from '../commands/monthReport';

function getTelegramUserId(ctx: Context): string | null {
    if (!ctx.from?.id) {
        return null;
    }

    return String(ctx.from.id);
}

export async function handleMenuText(ctx: Context): Promise<boolean> {
    if (!ctx.message || !('text' in ctx.message)) {
        return false;
    }

    const text = ctx.message.text.trim();

    if (text === BUTTONS.REPORTS) {
        await ctx.reply('Выбери отчёт:', getReportsKeyboard());
        return true;
    }

    if (text === BUTTONS.ACTIONS) {
        await ctx.reply('Выбери действие:', getActionsKeyboard());
        return true;
    }

    if (text === BUTTONS.BACK) {
        await ctx.reply('Главное меню:', getMainKeyboard());
        return true;
    }

    if (text === BUTTONS.HELP) {
        await ctx.reply(
            [
                'Что умеет бот:',
                '',
                '• Пиши еду обычным текстом',
                '• Я покажу черновик перед сохранением',
                '• Отчёты и действия доступны через кнопки',
                '',
                'Пример:',
                'гречка 150 г',
                'курица 200 г',
                'огурцы 100 г',
            ].join('\n'),
            getMainKeyboard()
        );
        return true;
    }

    if (text === BUTTONS.ADD_MEAL) {
        await ctx.reply(
            'Напиши, что ты съел.\n\nПример:\nгречка 150 г\nкурица 200 г\nяблоко 100 г',
            getMainKeyboard()
        );
        return true;
    }

    if (text === BUTTONS.DAILY_REPORT) {
        await dayReportCommand(ctx);
        await ctx.reply('Меню отчётов:', getReportsKeyboard());
        return true;
    }

    if (text === BUTTONS.WEEKLY_REPORT) {
        await weekReportCommand(ctx);
        await ctx.reply('Меню отчётов:', getReportsKeyboard());
        return true;
    }

    if (text === BUTTONS.MONTHLY_REPORT) {
        await monthReportCommand(ctx);
        await ctx.reply('Меню отчётов:', getReportsKeyboard());
        return true;
    }

    const userId = getTelegramUserId(ctx);

    if (!userId) {
        await ctx.reply('Не удалось определить пользователя.');
        return true;
    }

    if (text === BUTTONS.DELETE_LAST_MEAL) {
        const result = await deleteLastMeal(userId);

        if (!result.ok && result.reason === 'NOT_FOUND') {
            await ctx.reply('У тебя пока нет сохранённых приёмов пищи.', getActionsKeyboard());
            return true;
        }

        if (!result.ok) {
            await ctx.reply('Не удалось удалить последний приём пищи. Попробуй ещё раз.', getActionsKeyboard());
            return true;
        }

        await ctx.reply('✅ Последний приём пищи удалён.', getActionsKeyboard());
        return true;
    }

    if (text === BUTTONS.APPEND_LAST_MEAL) {
        await ctx.reply(
            'Скоро подключим добавление к последнему приёму пищи.',
            getActionsKeyboard()
        );
        return true;
    }

    if (text === BUTTONS.EDIT_LAST_MEAL) {
        await ctx.reply(
            'Скоро подключим изменение последнего приёма пищи.',
            getActionsKeyboard()
        );
        return true;
    }

    return false;
}