import { Context } from 'telegraf';
import { ensureTelegramUser } from '../../services/userService';
import { getMainKeyboard } from '../keyboards/mainKeyboard';

export async function startCommand(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    await ensureTelegramUser({
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
    });

    await ctx.reply(
        [
            'Привет 👋',
            'Я бот для учета питания.',
            '',
            'Как пользоваться:',
            '• Пиши еду обычным текстом',
            '• Перед сохранением я покажу черновик',
            '• Отчеты и действия доступны через кнопки снизу',
            '',
            'Примеры:',
            'овсянка 100 г',
            'курица 200 г',
            'яблоко 150 г',
            '',
            'Также доступны старые команды:',
            '/profile Иван, 30, 80, 180, MALE',
            '/eat овсянка 100 г',
            '/today',
        ].join('\n'),
        getMainKeyboard()
    );
}