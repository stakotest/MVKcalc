import { Context } from 'telegraf';
import { getPeriodAnalysis } from '../../services/dayAnalysisService';
import { getDateRangeLabel, getEndOfDay, getStartOfNDaysAgo } from '../../utils/dateRange';
import { getMealsByDateRange } from '../../services/mealService';
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

export async function weekReportCommand(ctx: Context) {
    if (!ctx.from) {
        return;
    }

    const endDate = getEndOfDay(new Date());
    const startDate = getStartOfNDaysAgo(6);
    const daysCount = 7;

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
        .slice(0, 5);

    const caloriesLine = analysis.calories.target
        ? `Средние калории: ${analysis.calories.averageActual} / ${analysis.calories.averageTarget} kcal — ${statusToText(
            analysis.calories.status ?? 'NORMAL'
        )}`
        : `Средние калории: ${analysis.calories.averageActual} kcal`;

    const buildTopLowSection = () => {
        if (!topLow.length) {
            return 'Самые слабые места:\n• нет';
        }

        return [
            'Самые слабые места:',
            ...topLow.map(
                (item) =>
                    `• ${translateNutrient(item.nutrientCode, item.nutrientName)}: ${item.percent}% от нормы за период`
            ),
        ].join('\n');
    };

    const fullReport = [
        `Отчет за неделю: ${getDateRangeLabel(startDate, endDate)}`,
        `Покрыто дней записями: ${coveredDays} из 7`,
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
    ].join('\n');

    const chunks = splitLongText(fullReport);

    for (const chunk of chunks) {
        await ctx.reply(chunk);
    }
}