import { prisma } from '../db/prisma';

async function main() {
    console.log('Начинаю очистку кэша продуктов...');

    const updatedMealItems = await prisma.mealItem.updateMany({
        data: {
            linkedFoodId: null,
        },
    });

    console.log(`Сбросил linkedFoodId у MealItem: ${updatedMealItems.count}`);

    const deletedFoodNutrients = await prisma.foodNutrient.deleteMany();
    console.log(`Удалил FoodNutrient: ${deletedFoodNutrients.count}`);

    const deletedFoodReferences = await prisma.foodReference.deleteMany();
    console.log(`Удалил FoodReference: ${deletedFoodReferences.count}`);

    console.log('Очистка кэша продуктов завершена.');
}

main()
    .catch((error) => {
        console.error('Ошибка при очистке кэша продуктов:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });