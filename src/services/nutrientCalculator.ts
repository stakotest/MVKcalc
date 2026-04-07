type NutrientRow = {
    nutrientCode: string;
    nutrientName: string;
    unit: string;
    amountPer100g: number;
};

export function calculateNutrientsForAmount(
    nutrientsPer100g: NutrientRow[],
    amountInGrams: number
) {
    const factor = amountInGrams / 100;

    return nutrientsPer100g.map((nutrient) => ({
        nutrientCode: nutrient.nutrientCode,
        nutrientName: nutrient.nutrientName,
        unit: nutrient.unit,
        amount: Number((nutrient.amountPer100g * factor).toFixed(2)),
    }));
}