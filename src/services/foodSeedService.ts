import { prisma } from '../db/prisma';
import { seedFoods } from '../data/seedFoods';

export async function seedLocalFoods() {
    for (const food of seedFoods) {
        const savedFood = await prisma.foodReference.upsert({
            where: {
                source_externalId: {
                    source: food.source,
                    externalId: food.externalId,
                },
            },
            update: {
                name: food.name,
                canonicalName: food.canonicalName,
                caloriesPer100g: food.caloriesPer100g,
                proteinPer100g: food.proteinPer100g,
                fatPer100g: food.fatPer100g,
                carbsPer100g: food.carbsPer100g,
                fiberPer100g: food.fiberPer100g,
            },
            create: {
                source: food.source,
                externalId: food.externalId,
                name: food.name,
                canonicalName: food.canonicalName,
                caloriesPer100g: food.caloriesPer100g,
                proteinPer100g: food.proteinPer100g,
                fatPer100g: food.fatPer100g,
                carbsPer100g: food.carbsPer100g,
                fiberPer100g: food.fiberPer100g,
            },
        });

        await prisma.foodNutrient.deleteMany({
            where: { foodId: savedFood.id },
        });

        await prisma.foodNutrient.createMany({
            data: food.nutrients.map((nutrient) => ({
                foodId: savedFood.id,
                nutrientCode: nutrient.nutrientCode,
                nutrientName: nutrient.nutrientName,
                unit: nutrient.unit,
                amountPer100g: nutrient.amountPer100g,
            })),
        });
    }
}