import { calculateNutrientsForAmount } from './nutrientCalculator';
import { findFoodByName } from './foodService';
import { parseFoodText } from '../utils/parseFoodText';
import { translateNutrient } from '../utils/translateNutrient';

function normalizeAmountToGrams(amountValue?: number, amountUnit?: string): number | null {
    if (amountValue == null) {
        return null;
    }

    if (!amountUnit) {
        return amountValue;
    }

    const unit = amountUnit.toLowerCase();

    if (unit === 'г' || unit === 'гр' || unit === 'g') {
        return amountValue;
    }

    if (unit === 'кг' || unit === 'kg') {
        return amountValue * 1000;
    }

    if (unit === 'мл' || unit === 'ml') {
        return amountValue;
    }

    return amountValue;
}

function formatAmountValue(value: number) {
    return Number(value.toFixed(2));
}

export async function getProductNutritionReport(input: string) {
    const parsedItems = parseFoodText(input);

    if (!parsedItems.length) {
        return {
            ok: false as const,
            message: 'Не смог понять продукт. Попробуй написать, например: "морковь 150 г" или "банан".',
        };
    }

    const firstItem = parsedItems[0];
    const productName = firstItem.productName.trim();

    if (!productName) {
        return {
            ok: false as const,
            message: 'Не смог понять название продукта.',
        };
    }

    const matchedFood = await findFoodByName(productName);

    if (!matchedFood) {
        return {
            ok: false as const,
            message: `Не нашёл продукт "${productName}" в базе.`,
        };
    }

    const amountInGrams = normalizeAmountToGrams(firstItem.amountValue, firstItem.amountUnit) ?? 100;
    const usedDefaultAmount = normalizeAmountToGrams(firstItem.amountValue, firstItem.amountUnit) === null;

    const nutrientsPer100g = matchedFood.nutrients ?? [];
    const calculatedNutrients = nutrientsPer100g.length
        ? calculateNutrientsForAmount(nutrientsPer100g, amountInGrams)
        : [];

    let calories = matchedFood.caloriesPer100g != null
        ? formatAmountValue((matchedFood.caloriesPer100g * amountInGrams) / 100)
        : null;

    if (calories === null) {
        const energy = calculatedNutrients.find((item) => item.nutrientCode === 'ENERGY_KCAL');
        if (energy) {
            calories = formatAmountValue(energy.amount);
        }
    }

    const orderedPriority = [
        'ENERGY_KCAL',
        'PROTEIN',
        'FAT',
        'CARBS',
        'FIBER',
    ];

    const orderedNutrients = [...calculatedNutrients].sort((a, b) => {
        const aPriority = orderedPriority.indexOf(a.nutrientCode);
        const bPriority = orderedPriority.indexOf(b.nutrientCode);

        if (aPriority !== -1 && bPriority !== -1) {
            return aPriority - bPriority;
        }

        if (aPriority !== -1) {
            return -1;
        }

        if (bPriority !== -1) {
            return 1;
        }

        return translateNutrient(a.nutrientCode, a.nutrientName).localeCompare(
            translateNutrient(b.nutrientCode, b.nutrientName),
            'ru'
        );
    });

    const lines: string[] = [];

    lines.push(`Продукт: ${productName}`);

    if (usedDefaultAmount) {
        lines.push('Расчёт сделан за 100 г, потому что вес не был указан.');
    } else {
        lines.push(`Расчёт сделан за ${formatAmountValue(amountInGrams)} г.`);
    }

    lines.push('');

    if (calories !== null) {
        lines.push(`Калории: ${calories} kcal`);
        lines.push('');
    }

    if (!orderedNutrients.length) {
        lines.push('Нутриенты для этого продукта пока не найдены.');
        return {
            ok: true as const,
            message: lines.join('\n'),
        };
    }

    lines.push('Нутриенты:');
    lines.push(
        ...orderedNutrients.map(
            (item) =>
                `• ${translateNutrient(item.nutrientCode, item.nutrientName)}: ${formatAmountValue(item.amount)} ${item.unit}`
        )
    );

    return {
        ok: true as const,
        message: lines.join('\n'),
    };
}