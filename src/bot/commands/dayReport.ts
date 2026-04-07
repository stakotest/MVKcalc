import { Context } from 'telegraf';
import { getDayAnalysis } from '../../services/dayAnalysisService';
import { getTodayMeals } from '../../services/mealService';
import { translateNutrient } from '../../utils/translateNutrient';

function statusToText(status: 'LOW' | 'NORMAL' | 'HIGH') {
    if (status === 'LOW') {
        return 'дефицит';
    }

    if (status === 'HIGH') {
        return 'избыток';
    }

    return 'норма';
}

function getItemDebugStatus(item: {
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

export async function dayReportCommand(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    const analysis = await getDayAnalysis(ctx.from.id);
    const meals = await getTodayMeals(ctx.from.id);

    const low = analysis.comparisons.filter((item) => item.status === 'LOW');
    const normal = analysis.comparisons.filter((item) => item.status === 'NORMAL');
    const high = analysis.comparisons.filter((item) => item.status === 'HIGH');

    const caloriesLine = analysis.calories.target
        ? `Калории: ${analysis.calories.actual} / ${analysis.calories.target} kcal — ${statusToText(
            analysis.calories.status ?? 'NORMAL'
        )}`
        : `Калории: ${analysis.calories.actual} kcal`;

    const mealsSection = meals.length
        ? [
            'Что съедено сегодня:',
            '',
            ...meals.map((meal, index) => {
                const items = meal.items.length
                    ? meal.items
                        .map((item) => {
                            const amount =
                                item.amountValue && item.amountUnit
                                    ? ` (${item.isApproximate ? '~' : ''}${item.amountValue} ${item.amountUnit})`
                                    : '';

                            const status = getItemDebugStatus(item);

                            return `   • ${item.productName}${amount} ${status}`;
                        })
                        .join('\n')
                    : '   • нет элементов';

                return `${index + 1}. ${meal.mealType ?? 'Прием пищи'}\n${items}`;
            }),
        ].join('\n')
        : 'Что съедено сегодня:\n• пока нет записей';

    const buildSection = (title: string, items: typeof analysis.comparisons) => {
        if (!items.length) {
            return `${title}:\n• нет`;
        }

        return [
            `${title}:`,
            ...items.map(
                (item) =>
                    `• ${translateNutrient(item.nutrientCode, item.nutrientName)}: ${item.actual} / ${item.target} ${item.unit} (${item.percent}%)`
            ),
        ].join('\n');
    };

    await ctx.reply(
        [
            `Отчет за сегодня: ${analysis.titleDate}`,
            '',
            mealsSection,
            '',
            caloriesLine,
            '',
            buildSection('Дефицит', low),
            '',
            buildSection('В норме', normal),
            '',
            buildSection('Избыток', high),
        ].join('\n')
    );
}