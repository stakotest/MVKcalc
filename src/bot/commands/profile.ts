import { Context } from 'telegraf';
import { ensureTelegramUser, updateUserProfile } from '../../services/userService';

export async function profileCommand(ctx: Context) {
    if (!ctx.from || !ctx.message || !('text' in ctx.message)) {
        return;
    }

    const text = ctx.message.text.replace('/profile', '').trim();

    if (!text) {
        await ctx.reply(
            'Формат:\n/profile Имя, возраст, вес, рост, пол\n\nПример:\n/profile Alex, 30, 82, 180, MALE'
        );
        return;
    }

    const parts = text.split(',').map((p) => p.trim());

    if (parts.length < 5) {
        await ctx.reply('Нужно 5 значений: Имя, возраст, вес, рост, пол');
        return;
    }

    const [name, ageRaw, weightRaw, heightRaw, genderRaw] = parts;

    await ensureTelegramUser({
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
    });

    await updateUserProfile({
        telegramId: ctx.from.id,
        name,
        age: Number(ageRaw),
        weightKg: Number(weightRaw),
        heightCm: Number(heightRaw),
        gender: genderRaw.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER',
        timezone: 'Europe/Amsterdam',
    });

    await ctx.reply('Профиль сохранен ✅');
}