import { Context } from 'telegraf';
import { getDailyTargetsForUser } from '../../services/recommendationService';
import { translateNutrient } from '../../utils/translateNutrient';

export async function myNormsCommand(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    const targets = await getDailyTargetsForUser(ctx.from.id);

    if (!targets) {
        await ctx.reply(
            [
                'Сначала заполни профиль, чтобы я мог рассчитать нормы.',
                '',
                'Пример:',
                '/profile Alex, 30, 82, 180, MALE',
            ].join('\n')
        );
        return;
    }

    const profileMissingMainData =
        targets.caloriesTarget === null ||
        targets.proteinTarget === null ||
        targets.fatTarget === null ||
        targets.carbTarget === null;

    const caloriesBlock = profileMissingMainData
        ? [
            'Калории и БЖУ пока не могу рассчитать полностью.',
            'Для этого нужны возраст, вес, рост и пол в профиле.',
        ].join('\n')
        : [
            `Калории: ${targets.caloriesTarget} kcal`,
            `Белок: ${targets.proteinTarget} г`,
            `Жиры: ${targets.fatTarget} г`,
            `Углеводы: ${targets.carbTarget} г`,
        ].join('\n');

    const micronutrientsBlock = targets.micronutrients.length
        ? [
            'Микронутриенты:',
            ...targets.micronutrients.map(
                (item) =>
                    `• ${translateNutrient(item.nutrientCode, item.nutrientName)}: ${item.amount} ${item.unit}`
            ),
        ].join('\n')
        : 'Микронутриенты: нет данных';

    await ctx.reply(
        [
            'Твои дневные нормы:',
            '',
            caloriesBlock,
            '',
            micronutrientsBlock,
        ].join('\n')
    );
}