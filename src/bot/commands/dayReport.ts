import { Context } from 'telegraf';
import { getDayAnalysis } from '../../services/dayAnalysisService';
import { getTodayMeals } from '../../services/mealService';
import { translateNutrient } from '../../utils/translateNutrient';

const TELEGRAM_MESSAGE_LIMIT = 4000;

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

function buildSection(
    title: string,
    items: Array<{
        nutrientCode: string;
        nutrientName: string;
        actual: number;
        target: number;
        unit: string;
        percent: number;
    }>
) {
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
}

function splitLongText(text: string, maxLength = TELEGRAM_MESSAGE_LIMIT): string[] {
    if (text.length <= maxLength) {
        return [text];
    }

    const chunks: string[] = [];
    let currentChunk = '';

    const paragraphs = text.split('\n\n');

    for (const paragraph of paragraphs) {
        const candidate = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;

        if (candidate.length <= maxLength) {
            currentChunk = candidate;
            continue;
        }

        if (currentChunk) {
            chunks.push(currentChunk);
            currentChunk = '';
        }

        if (paragraph.length <= maxLength) {
            currentChunk = paragraph;
            continue;
        }

        const lines = paragraph.split('\n');
        let lineChunk = '';

        for (const line of lines) {
            const lineCandidate = lineChunk ? `${lineChunk}\n${line}` : line;

            if (lineCandidate.length <= maxLength) {
                lineChunk = lineCandidate;
                continue;
            }

            if (lineChunk) {
                chunks.push(lineChunk);
                lineChunk = '';
            }

            if (line.length <= maxLength) {
                lineChunk = line;
                continue;
            }

            let start = 0;
            while (start < line.length) {
                chunks.push(line.slice(start, start + maxLength));
                start += maxLength;
            }
        }

        if (lineChunk) {
            currentChunk = lineChunk;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
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

    const fullReport = [
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
    ].join('\n');

    const chunks = splitLongText(fullReport);

    for (const chunk of chunks) {
        await ctx.reply(chunk);
    }
}