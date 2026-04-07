import { Context } from 'telegraf';
import { getTodayMeals } from '../../services/mealService';

export async function todayCommand(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    const meals = await getTodayMeals(ctx.from.id);

    if (!meals.length) {
        await ctx.reply('Сегодня пока нет записей.');
        return;
    }

    const text = meals
        .map((meal, index) => {
            const items = meal.items.map((item) => {
                const amount =
                    item.amountValue && item.amountUnit
                        ? ` (${item.isApproximate ? '~' : ''}${item.amountValue} ${item.amountUnit})`
                        : '';
                return `   - ${item.productName}${amount}`;
            });

            return [`${index + 1}. Прием пищи`, ...items].join('\n');
        })
        .join('\n\n');

    await ctx.reply(`Сегодня съедено:\n\n${text}`);
}