import { prisma } from '../db/prisma';
import { FOOD_DICTIONARY, FoodDictionaryItem } from '../constants/foodDictionary';
import { fetchUsdaFoodById, searchUsdaFoodByName, SavedUsdaFood } from './usdaFoodService';

function normalizeFoodName(name: string): string {
    return name
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[.,()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function toWordSet(value: string): string[] {
    return normalizeFoodName(value)
        .split(' ')
        .map((w) => w.trim())
        .filter(Boolean);
}

function scoreAliasMatch(input: string, alias: string): number {
    const normalizedInput = normalizeFoodName(input);
    const normalizedAlias = normalizeFoodName(alias);

    if (normalizedInput === normalizedAlias) {
        return 100;
    }

    if (
        normalizedInput.includes(normalizedAlias) ||
        normalizedAlias.includes(normalizedInput)
    ) {
        return 70;
    }

    const inputWords = toWordSet(normalizedInput);
    const aliasWords = toWordSet(normalizedAlias);
    const commonWords = inputWords.filter((word) => aliasWords.includes(word)).length;

    if (commonWords > 0) {
        return commonWords * 10;
    }

    return 0;
}

function findFoodInDictionary(inputName: string): FoodDictionaryItem | null {
    let bestMatch: FoodDictionaryItem | null = null;
    let bestScore = 0;

    for (const item of FOOD_DICTIONARY) {
        for (const alias of item.aliases) {
            const score = scoreAliasMatch(inputName, alias);

            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        }
    }

    return bestScore >= 70 ? bestMatch : null;
}

function hasUsefulNutritionData(food: {
    hasNutritionData?: boolean | null;
    caloriesPer100g?: number | null;
    nutrients?: Array<unknown>;
} | null | undefined): boolean {
    if (!food) {
        return false;
    }

    if (food.hasNutritionData === true) {
        return true;
    }

    const hasCalories = typeof food.caloriesPer100g === 'number';
    const hasNutrients = Array.isArray(food.nutrients) && food.nutrients.length > 0;

    return hasCalories || hasNutrients;
}

async function findFoodInLocalDb(inputName: string) {
    const normalized = normalizeFoodName(inputName);

    const exactMatch = await prisma.foodReference.findFirst({
        where: {
            OR: [
                {
                    name: {
                        equals: normalized,
                        mode: 'insensitive',
                    },
                },
                {
                    canonicalName: {
                        equals: normalized,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        include: {
            nutrients: true,
        },
    });

    if (exactMatch) {
        return exactMatch;
    }

    const partialMatches = await prisma.foodReference.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: normalized,
                        mode: 'insensitive',
                    },
                },
                {
                    canonicalName: {
                        contains: normalized,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        include: {
            nutrients: true,
        },
        take: 10,
    });

    const partialWithNutrition = partialMatches.find((food) => hasUsefulNutritionData(food));
    if (partialWithNutrition) {
        return partialWithNutrition;
    }

    return partialMatches[0] ?? null;
}

async function saveUsdaFoodToDb(usdaFood: SavedUsdaFood) {
    const savedFood = await prisma.foodReference.upsert({
        where: {
            source_externalId: {
                source: usdaFood.source,
                externalId: usdaFood.externalId,
            },
        },
        update: {
            name: usdaFood.name,
            canonicalName: usdaFood.canonicalName,
            caloriesPer100g: usdaFood.caloriesPer100g,
            proteinPer100g: usdaFood.proteinPer100g,
            fatPer100g: usdaFood.fatPer100g,
            carbsPer100g: usdaFood.carbsPer100g,
            fiberPer100g: usdaFood.fiberPer100g,
            hasNutritionData: usdaFood.nutrients.length > 0 || usdaFood.caloriesPer100g != null,
        },
        create: {
            source: usdaFood.source,
            externalId: usdaFood.externalId,
            name: usdaFood.name,
            canonicalName: usdaFood.canonicalName,
            caloriesPer100g: usdaFood.caloriesPer100g,
            proteinPer100g: usdaFood.proteinPer100g,
            fatPer100g: usdaFood.fatPer100g,
            carbsPer100g: usdaFood.carbsPer100g,
            fiberPer100g: usdaFood.fiberPer100g,
            hasNutritionData: usdaFood.nutrients.length > 0 || usdaFood.caloriesPer100g != null,
        },
    });

    await prisma.foodNutrient.deleteMany({
        where: { foodId: savedFood.id },
    });

    if (usdaFood.nutrients.length) {
        await prisma.foodNutrient.createMany({
            data: usdaFood.nutrients.map((nutrient) => ({
                foodId: savedFood.id,
                nutrientCode: nutrient.nutrientCode,
                nutrientName: nutrient.nutrientName,
                unit: nutrient.unit,
                amountPer100g: nutrient.amountPer100g,
            })),
        });
    }

    return prisma.foodReference.findUniqueOrThrow({
        where: { id: savedFood.id },
        include: { nutrients: true },
    });
}

export async function findFoodByName(inputName: string) {
    const dictionaryFood = findFoodInDictionary(inputName);

    if (dictionaryFood?.fdcId) {
        const localByExternalId = await prisma.foodReference.findFirst({
            where: {
                source: 'USDA',
                externalId: String(dictionaryFood.fdcId),
            },
            include: {
                nutrients: true,
            },
        });

        if (localByExternalId && hasUsefulNutritionData(localByExternalId)) {
            return localByExternalId;
        }

        const usdaById = await fetchUsdaFoodById(dictionaryFood.fdcId);

        if (usdaById) {
            return saveUsdaFoodToDb(usdaById);
        }
    }

    if (dictionaryFood) {
        const localByLookup = await findFoodInLocalDb(dictionaryFood.lookupNameEn);

        if (localByLookup && hasUsefulNutritionData(localByLookup)) {
            return localByLookup;
        }

        const usdaFood = await searchUsdaFoodByName(dictionaryFood.lookupNameEn);

        if (usdaFood) {
            return saveUsdaFoodToDb(usdaFood);
        }

        if (localByLookup) {
            return localByLookup;
        }
    }

    const localFood = await findFoodInLocalDb(inputName);

    if (localFood && hasUsefulNutritionData(localFood)) {
        return localFood;
    }

    const usdaFood = await searchUsdaFoodByName(inputName);

    if (usdaFood) {
        return saveUsdaFoodToDb(usdaFood);
    }

    return localFood ?? null;
}