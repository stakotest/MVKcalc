import { prisma } from '../db/prisma';
import { parseFoodText, ParsedFoodItem } from '../utils/parseFoodText';
import { getUserByTelegramId } from './userService';
import { findFoodByName } from './foodService';
import { calculateNutrientsForAmount } from './nutrientCalculator';
import { getEndOfDay, getStartOfDay } from '../utils/dateRange';

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

    if (unit === 'шт' || unit === 'pcs') {
        return null;
    }

    return amountValue;
}

async function createMealItemWithNutrition(params: {
    mealId: string;
    productName: string;
    amountValue?: number;
    amountUnit?: string;
    isApproximate?: boolean;
    rawText?: string;
}) {
    let matchedFood = null;

    try {
        matchedFood = await findFoodByName(params.productName);
    } catch (error) {
        console.error(`Food lookup failed for "${params.productName}":`, error);
        matchedFood = null;
    }

    const amountInGrams = normalizeAmountToGrams(params.amountValue, params.amountUnit);

    let calculatedCalories: number | null =
        matchedFood?.caloriesPer100g != null && amountInGrams !== null
            ? Number(((matchedFood.caloriesPer100g * amountInGrams) / 100).toFixed(2))
            : null;

    const createdMealItem = await prisma.mealItem.create({
        data: {
            mealId: params.mealId,
            productName: params.productName,
            amountValue: params.amountValue,
            amountUnit: params.amountUnit,
            isApproximate: params.isApproximate ?? false,
            rawText: params.rawText,
            linkedFoodId: matchedFood?.id,
            caloriesKcal: calculatedCalories,
        },
    });

    if (!matchedFood || amountInGrams === null) {
        return createdMealItem;
    }

    try {
        const nutrients = matchedFood.nutrients ?? [];

        if (nutrients.length) {
            const snapshots = calculateNutrientsForAmount(nutrients, amountInGrams);

            if (snapshots.length) {
                await prisma.mealItemNutrientSnapshot.createMany({
                    data: snapshots.map((nutrient) => ({
                        mealItemId: createdMealItem.id,
                        nutrientCode: nutrient.nutrientCode,
                        nutrientName: nutrient.nutrientName,
                        unit: nutrient.unit,
                        amount: nutrient.amount,
                    })),
                });

                if (calculatedCalories === null) {
                    const energySnapshot = snapshots.find(
                        (nutrient) => nutrient.nutrientCode === 'ENERGY_KCAL'
                    );

                    if (energySnapshot) {
                        calculatedCalories = Number(energySnapshot.amount.toFixed(2));

                        await prisma.mealItem.update({
                            where: {
                                id: createdMealItem.id,
                            },
                            data: {
                                caloriesKcal: calculatedCalories,
                            },
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Nutrient snapshot creation failed for "${params.productName}":`, error);
    }

    return createdMealItem;
}

export async function addMealFromParsedItems(params: {
    telegramId: number;
    mealType?: string;
    title?: string;
    rawInput: string;
    items: ParsedFoodItem[];
}) {
    const user = await getUserByTelegramId(params.telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    const meal = await prisma.meal.create({
        data: {
            userId: user.id,
            rawInput: params.rawInput,
            mealType: params.mealType,
            title: params.title,
            eatenAt: new Date(),
        },
    });

    for (const item of params.items) {
        await createMealItemWithNutrition({
            mealId: meal.id,
            productName: item.productName,
            amountValue: item.amountValue,
            amountUnit: item.amountUnit,
            isApproximate: item.isApproximate,
            rawText: item.rawText,
        });
    }

    return prisma.meal.findUnique({
        where: { id: meal.id },
        include: {
            items: {
                include: {
                    nutrientSnapshots: true,
                    linkedFood: true,
                },
            },
        },
    });
}

export async function addMealFromText(params: {
    telegramId: number;
    rawInput: string;
    mealType?: string;
    title?: string;
}) {
    const parsedItems = parseFoodText(params.rawInput);

    return addMealFromParsedItems({
        telegramId: params.telegramId,
        rawInput: params.rawInput,
        mealType: params.mealType,
        title: params.title,
        items: parsedItems,
    });
}

export async function getMealsByDateRange(
    telegramId: number,
    startDate: Date,
    endDate: Date
) {
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    return prisma.meal.findMany({
        where: {
            userId: user.id,
            eatenAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            items: {
                include: {
                    nutrientSnapshots: true,
                    linkedFood: true,
                },
            },
        },
        orderBy: {
            eatenAt: 'asc',
        },
    });
}

export async function getTodayMeals(telegramId: number) {
    const start = getStartOfDay(new Date());
    const end = getEndOfDay(new Date());

    return getMealsByDateRange(telegramId, start, end);
}

export async function getTotalsByDateRange(
    telegramId: number,
    startDate: Date,
    endDate: Date
) {
    const meals = await getMealsByDateRange(telegramId, startDate, endDate);

    const totals = new Map<
        string,
        { nutrientName: string; unit: string; amount: number }
    >();

    let totalCalories = 0;

    for (const meal of meals) {
        for (const item of meal.items) {
            let itemCalories = item.caloriesKcal ?? 0;

            if (!itemCalories) {
                const energySnapshot = item.nutrientSnapshots.find(
                    (n) => n.nutrientCode === 'ENERGY_KCAL'
                );

                if (energySnapshot) {
                    itemCalories = energySnapshot.amount;
                }
            }

            totalCalories += itemCalories;

            for (const nutrient of item.nutrientSnapshots) {
                const current = totals.get(nutrient.nutrientCode);

                if (!current) {
                    totals.set(nutrient.nutrientCode, {
                        nutrientName: nutrient.nutrientName,
                        unit: nutrient.unit,
                        amount: nutrient.amount,
                    });
                } else {
                    current.amount += nutrient.amount;
                }
            }
        }
    }

    return {
        caloriesKcal: Number(totalCalories.toFixed(2)),
        nutrients: Array.from(totals.entries()).map(([nutrientCode, data]) => ({
            nutrientCode,
            nutrientName: data.nutrientName,
            unit: data.unit,
            amount: Number(data.amount.toFixed(2)),
        })),
    };
}

export async function getTodayTotals(telegramId: number) {
    const start = getStartOfDay(new Date());
    const end = getEndOfDay(new Date());

    return getTotalsByDateRange(telegramId, start, end);
}