import { Context } from 'telegraf';
import { addMealFromText, getTodayMeals } from '../../services/mealService';

export async function eatCommand(ctx: Context) {
    if (!ctx.from || !ctx.message || !('text' in ctx.message)) {
        return;
    }

    const text = ctx.message.text.replace('/eat', '').trim();

    if (!text) {
        await ctx.reply(
            'Напиши еду после команды.\n\nПример:\n/eat овсянка 100 г\nбанан\nйогурт ~150 г'
        );
        return;
    }

    const meal = await addMealFromText({
        telegramId: ctx.from.id,
        rawInput: text,
    });

    if (!meal) {
        await ctx.reply('Не удалось сохранить прием пищи');
        return;
    }

    const itemsText = meal.items
        .map((item) => {
            const amount =
                item.amountValue && item.amountUnit
                    ? ` — ${item.isApproximate ? '~' : ''}${item.amountValue} ${item.amountUnit}`
                    : '';

            const status = item.linkedFood
                ? ` [найдено: ${item.linkedFood.name}]`
                : ' [не найдено]';

            const kcal =
                typeof item.caloriesKcal === 'number' ? ` | ${item.caloriesKcal} kcal` : '';

            return `• ${item.productName}${amount}${status}${kcal}`;
        })
        .join('\n');

    const todayMeals = await getTodayMeals(ctx.from.id);

    await ctx.reply(
        [
            'Добавлено ✅',
            '',
            itemsText,
            '',
            `Всего приемов пищи сегодня: ${todayMeals.length}`,
        ].join('\n')
    );
}