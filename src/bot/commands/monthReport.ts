import { Context } from 'telegraf';
import { getPeriodAnalysis } from '../../services/dayAnalysisService';
import { getDateRangeLabel, getEndOfDay, getStartOfNDaysAgo } from '../../utils/dateRange';
import { getMealsByDateRange } from '../../services/mealService';
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

export async function monthReportCommand(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    const endDate = getEndOfDay(new Date());
    const startDate = getStartOfNDaysAgo(29);
    const daysCount = 30;

    const analysis = await getPeriodAnalysis(ctx.from.id, startDate, endDate, daysCount);
    const meals = await getMealsByDateRange(ctx.from.id, startDate, endDate);

    const coveredDays = new Set(
        meals.map((meal) => {
            const date = new Date(meal.eatenAt);
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
    ).size;

    const low = analysis.comparisons.filter((item) => item.status === 'LOW');
    const normal = analysis.comparisons.filter((item) => item.status === 'NORMAL');
    const high = analysis.comparisons.filter((item) => item.status === 'HIGH');

    const topLow = [...low]
        .sort((a, b) => a.percent - b.percent)
        .slice(0, 7);

    const caloriesLine = analysis.calories.target
        ? `Средние калории: ${analysis.calories.averageActual} / ${analysis.calories.averageTarget} kcal — ${statusToText(
            analysis.calories.status ?? 'NORMAL'
        )}`
        : `Средние калории: ${analysis.calories.averageActual} kcal`;

    const buildSection = (
        title: string,
        items: typeof analysis.comparisons
    ) => {
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

    const buildTopLowSection = () => {
        if (!topLow.length) {
            return 'Самые слабые места:\n• нет';
        }

        return [
            'Самые слабые места:',
            ...topLow.map(
                (item) => `• ${translateNutrient(item.nutrientCode, item.nutrientName)}: ${item.percent}% от нормы за период`
            ),
        ].join('\n');
    };

    await ctx.reply(
        [
            `Отчет за месяц: ${getDateRangeLabel(startDate, endDate)}`,
            `Покрыто дней записями: ${coveredDays} из 30`,
            '',
            caloriesLine,
            '',
            buildTopLowSection(),
            '',
            buildSection('Дефицит', low),
            '',
            buildSection('В норме', normal),
            '',
            buildSection('Избыток', high),
        ].join('\n')
    );
}