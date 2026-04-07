import { getTodayTotals, getTotalsByDateRange } from './mealService';
import { getDailyTargetsForUser } from './recommendationService';
import { formatDate } from '../utils/dateRange';

type ComparisonStatus = 'LOW' | 'NORMAL' | 'HIGH';

function getStatus(percent: number): ComparisonStatus {
    if (percent < 80) {
        return 'LOW';
    }

    if (percent > 120) {
        return 'HIGH';
    }

    return 'NORMAL';
}

function buildComparisons(
    totals: Awaited<ReturnType<typeof getTodayTotals>>,
    targets: Awaited<ReturnType<typeof getDailyTargetsForUser>>
) {
    const nutrientsMap = new Map(
        totals.nutrients.map((item) => [item.nutrientCode, item])
    );

    const comparisons: Array<{
        nutrientCode: string;
        nutrientName: string;
        unit: string;
        actual: number;
        target: number;
        percent: number;
        status: ComparisonStatus;
    }> = [];

    if (targets) {
        if (targets.proteinTarget) {
            const protein = nutrientsMap.get('PROTEIN');
            const actual = protein?.amount ?? 0;
            const percent = targets.proteinTarget > 0 ? (actual / targets.proteinTarget) * 100 : 0;

            comparisons.push({
                nutrientCode: 'PROTEIN',
                nutrientName: 'Protein',
                unit: 'g',
                actual: Number(actual.toFixed(2)),
                target: targets.proteinTarget,
                percent: Number(percent.toFixed(0)),
                status: getStatus(percent),
            });
        }

        if (targets.fatTarget) {
            const fat = nutrientsMap.get('FAT');
            const actual = fat?.amount ?? 0;
            const percent = targets.fatTarget > 0 ? (actual / targets.fatTarget) * 100 : 0;

            comparisons.push({
                nutrientCode: 'FAT',
                nutrientName: 'Fat',
                unit: 'g',
                actual: Number(actual.toFixed(2)),
                target: targets.fatTarget,
                percent: Number(percent.toFixed(0)),
                status: getStatus(percent),
            });
        }

        if (targets.carbTarget) {
            const carbs = nutrientsMap.get('CARBS');
            const actual = carbs?.amount ?? 0;
            const percent = targets.carbTarget > 0 ? (actual / targets.carbTarget) * 100 : 0;

            comparisons.push({
                nutrientCode: 'CARBS',
                nutrientName: 'Carbohydrates',
                unit: 'g',
                actual: Number(actual.toFixed(2)),
                target: targets.carbTarget,
                percent: Number(percent.toFixed(0)),
                status: getStatus(percent),
            });
        }

        for (const target of targets.micronutrients) {
            const actualNutrient = nutrientsMap.get(target.nutrientCode);
            const actual = actualNutrient?.amount ?? 0;
            const percent = target.amount > 0 ? (actual / target.amount) * 100 : 0;

            comparisons.push({
                nutrientCode: target.nutrientCode,
                nutrientName: target.nutrientName,
                unit: target.unit,
                actual: Number(actual.toFixed(2)),
                target: target.amount,
                percent: Number(percent.toFixed(0)),
                status: getStatus(percent),
            });
        }
    }

    return comparisons;
}

export async function getDayAnalysis(telegramId: number) {
    const totals = await getTodayTotals(telegramId);
    const targets = await getDailyTargetsForUser(telegramId);

    const comparisons = buildComparisons(totals, targets);

    const caloriesTarget = targets?.caloriesTarget ?? null;
    const caloriesPercent =
        caloriesTarget && caloriesTarget > 0
            ? Number(((totals.caloriesKcal / caloriesTarget) * 100).toFixed(0))
            : null;

    return {
        titleDate: formatDate(new Date()),
        calories: {
            actual: totals.caloriesKcal,
            target: caloriesTarget,
            percent: caloriesPercent,
            status:
                caloriesPercent === null
                    ? null
                    : getStatus(caloriesPercent),
        },
        comparisons,
        rawTotals: totals,
    };
}

export async function getPeriodAnalysis(
    telegramId: number,
    startDate: Date,
    endDate: Date,
    daysCount: number
) {
    const totals = await getTotalsByDateRange(telegramId, startDate, endDate);
    const targets = await getDailyTargetsForUser(telegramId);

    const dailyCaloriesTarget = targets?.caloriesTarget ?? null;
    const periodCaloriesTarget =
        dailyCaloriesTarget !== null ? dailyCaloriesTarget * daysCount : null;

    const comparisons = buildComparisons(totals, targets)
        .map((item) => {
            const periodTarget = item.target * daysCount;
            const percent = periodTarget > 0 ? (item.actual / periodTarget) * 100 : 0;

            return {
                ...item,
                target: Number(periodTarget.toFixed(2)),
                percent: Number(percent.toFixed(0)),
                status: getStatus(percent),
            };
        });

    const caloriesPercent =
        periodCaloriesTarget && periodCaloriesTarget > 0
            ? Number(((totals.caloriesKcal / periodCaloriesTarget) * 100).toFixed(0))
            : null;

    const averageCalories =
        daysCount > 0 ? Number((totals.caloriesKcal / daysCount).toFixed(2)) : 0;

    return {
        periodStart: startDate,
        periodEnd: endDate,
        daysCount,
        calories: {
            actual: totals.caloriesKcal,
            target: periodCaloriesTarget,
            percent: caloriesPercent,
            averageActual: averageCalories,
            averageTarget: dailyCaloriesTarget,
            status: caloriesPercent === null ? null : getStatus(caloriesPercent),
        },
        comparisons,
        rawTotals: totals,
    };
}