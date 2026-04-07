import { Markup } from 'telegraf';

export function draftKeyboard() {
    return Markup.inlineKeyboard([
        [
            Markup.button.callback('✅ Сохранить', 'draft_confirm'),
            Markup.button.callback('❌ Отмена', 'draft_cancel'),
        ],
    ]);
}