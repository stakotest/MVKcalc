import axios from 'axios';
import { env } from '../config/env';
import { mapUsdaNutrientName } from '../constants/usdaNutrientMap';

type UsdaFoodSearchItem = {
    fdcId: number;
    description: string;
    dataType?: string;
};

type UsdaFoodDetailsResponse = {
    fdcId: number;
    description: string;
    dataType?: string;
    foodNutrients?: Array<{
        nutrient?: {
            name?: string;
            unitName?: string;
        };
        nutrientName?: string;
        unitName?: string;
        amount?: number;
    }>;
};

type SavedUsdaNutrient = {
    nutrientCode: string;
    nutrientName: string;
    unit: string;
    amountPer100g: number;
};

export type SavedUsdaFood = {
    source: string;
    externalId: string;
    name: string;
    canonicalName: string;
    caloriesPer100g: number | null;
    proteinPer100g: number | null;
    fatPer100g: number | null;
    carbsPer100g: number | null;
    fiberPer100g: number | null;
    nutrients: SavedUsdaNutrient[];
};

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[(),.]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function pickBestFoodMatch(foods: UsdaFoodSearchItem[], query: string): UsdaFoodSearchItem | null {
    const normalizedQuery = normalizeText(query);

    const scored = foods.map((food) => {
        const description = normalizeText(food.description);
        let score = 0;

        if (description === normalizedQuery) score += 100;
        if (description.includes(normalizedQuery)) score += 50;
        if (normalizedQuery.includes(description)) score += 25;
        if (food.dataType === 'Foundation') score += 10;
        if (food.dataType === 'SR Legacy') score += 8;
        if (food.dataType === 'Survey (FNDDS)') score += 6;

        return { food, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored[0]?.food ?? null;
}

function isSavedUsdaNutrient(value: SavedUsdaNutrient | null): value is SavedUsdaNutrient {
    return value !== null;
}

function mapFoodDetailsToSavedFood(details: UsdaFoodDetailsResponse): SavedUsdaFood {
    const rawNutrients = details.foodNutrients ?? [];

    const mappedNutrients: SavedUsdaNutrient[] = rawNutrients
        .map((item): SavedUsdaNutrient | null => {
            const rawName = item.nutrient?.name ?? item.nutrientName ?? '';
            const amount = item.amount;
            const meta = mapUsdaNutrientName(rawName);

            if (!meta || typeof amount !== 'number') {
                return null;
            }

            return {
                nutrientCode: meta.code,
                nutrientName: meta.name,
                unit: meta.unit,
                amountPer100g: amount,
            };
        })
        .filter(isSavedUsdaNutrient);

    const uniqueNutrients = Array.from(
        new Map(mappedNutrients.map((item) => [item.nutrientCode, item])).values()
    );

    const energy =
        uniqueNutrients.find((n) => n.nutrientCode === 'ENERGY_KCAL')?.amountPer100g ?? null;
    const protein =
        uniqueNutrients.find((n) => n.nutrientCode === 'PROTEIN')?.amountPer100g ?? null;
    const fat =
        uniqueNutrients.find((n) => n.nutrientCode === 'FAT')?.amountPer100g ?? null;
    const carbs =
        uniqueNutrients.find((n) => n.nutrientCode === 'CARBS')?.amountPer100g ?? null;
    const fiber =
        uniqueNutrients.find((n) => n.nutrientCode === 'FIBER')?.amountPer100g ?? null;

    return {
        source: 'USDA',
        externalId: String(details.fdcId),
        name: details.description,
        canonicalName: normalizeText(details.description),
        caloriesPer100g: energy,
        proteinPer100g: protein,
        fatPer100g: fat,
        carbsPer100g: carbs,
        fiberPer100g: fiber,
        nutrients: uniqueNutrients,
    };
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry<T>(url: string, params: Record<string, string | number>) {
    const attempts = 3;
    const timeouts = [30000, 30000, 45000];

    let lastError: unknown = null;

    for (let i = 0; i < attempts; i++) {
        try {
            const response = await axios.get<T>(url, {
                params,
                timeout: timeouts[i],
            });

            return response.data;
        } catch (error) {
            lastError = error;
            console.error(`USDA request failed (attempt ${i + 1}/${attempts}):`, error);

            if (i < attempts - 1) {
                await sleep(700 * (i + 1));
            }
        }
    }

    throw lastError;
}

export async function fetchUsdaFoodById(fdcId: number): Promise<SavedUsdaFood | null> {
    if (!env.USDA_API_KEY) {
        return null;
    }

    try {
        const details = await fetchJsonWithRetry<UsdaFoodDetailsResponse>(
            `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
            { api_key: env.USDA_API_KEY }
        );

        if (!details) {
            return null;
        }

        return mapFoodDetailsToSavedFood(details);
    } catch (error) {
        console.error('USDA details fetch error:', error);
        return null;
    }
}

export async function searchUsdaFoodByName(query: string): Promise<SavedUsdaFood | null> {
    if (!env.USDA_API_KEY) {
        return null;
    }

    try {
        const searchResult = await fetchJsonWithRetry<{ foods?: UsdaFoodSearchItem[] }>(
            'https://api.nal.usda.gov/fdc/v1/foods/search',
            {
                api_key: env.USDA_API_KEY,
                query,
                pageSize: 10,
            }
        );

        const foods: UsdaFoodSearchItem[] = searchResult?.foods ?? [];

        if (!foods.length) {
            return null;
        }

        const bestFood = pickBestFoodMatch(foods, query);

        if (!bestFood) {
            return null;
        }

        return fetchUsdaFoodById(bestFood.fdcId);
    } catch (error) {
        console.error('USDA search error:', error);
        return null;
    }
}