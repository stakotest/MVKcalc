import { prisma } from '../../db/prisma';

export type DeleteLastMealResult =
    | { ok: true; deletedMealId: string }
    | { ok: false; reason: 'NOT_FOUND' | 'UNKNOWN_ERROR' };

export async function deleteLastMeal(userId: string): Promise<DeleteLastMealResult> {
    try {
        const lastMeal = await prisma.meal.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
            },
        });

        if (!lastMeal) {
            return { ok: false, reason: 'NOT_FOUND' };
        }

        await prisma.$transaction(async (tx) => {
            const mealItems = await tx.mealItem.findMany({
                where: {
                    mealId: lastMeal.id,
                },
                select: {
                    id: true,
                },
            });

            const mealItemIds = mealItems.map((item) => item.id);

            if (mealItemIds.length > 0) {
                await tx.mealItemNutrientSnapshot.deleteMany({
                    where: {
                        mealItemId: {
                            in: mealItemIds,
                        },
                    },
                });
            }

            await tx.mealItem.deleteMany({
                where: {
                    mealId: lastMeal.id,
                },
            });

            await tx.meal.delete({
                where: {
                    id: lastMeal.id,
                },
            });
        });

        return {
            ok: true,
            deletedMealId: lastMeal.id,
        };
    } catch (error) {
        console.error('[deleteLastMeal] error:', error);
        return { ok: false, reason: 'UNKNOWN_ERROR' };
    }
}