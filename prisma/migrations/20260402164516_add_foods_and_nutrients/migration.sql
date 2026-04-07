-- AlterTable
ALTER TABLE "MealItem" ADD COLUMN     "caloriesKcal" DOUBLE PRECISION,
ADD COLUMN     "linkedFoodId" TEXT;

-- CreateTable
CREATE TABLE "FoodReference" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "canonicalName" TEXT,
    "portionBasis" TEXT DEFAULT '100g',
    "caloriesPer100g" DOUBLE PRECISION,
    "proteinPer100g" DOUBLE PRECISION,
    "fatPer100g" DOUBLE PRECISION,
    "carbsPer100g" DOUBLE PRECISION,
    "fiberPer100g" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodNutrient" (
    "id" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "nutrientCode" TEXT NOT NULL,
    "nutrientName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "amountPer100g" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodNutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealItemNutrientSnapshot" (
    "id" TEXT NOT NULL,
    "mealItemId" TEXT NOT NULL,
    "nutrientCode" TEXT NOT NULL,
    "nutrientName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealItemNutrientSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodReference_source_externalId_key" ON "FoodReference"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodNutrient_foodId_nutrientCode_key" ON "FoodNutrient"("foodId", "nutrientCode");

-- CreateIndex
CREATE INDEX "MealItemNutrientSnapshot_mealItemId_idx" ON "MealItemNutrientSnapshot"("mealItemId");

-- CreateIndex
CREATE INDEX "MealItemNutrientSnapshot_nutrientCode_idx" ON "MealItemNutrientSnapshot"("nutrientCode");

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_linkedFoodId_fkey" FOREIGN KEY ("linkedFoodId") REFERENCES "FoodReference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodNutrient" ADD CONSTRAINT "FoodNutrient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "FoodReference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItemNutrientSnapshot" ADD CONSTRAINT "MealItemNutrientSnapshot_mealItemId_fkey" FOREIGN KEY ("mealItemId") REFERENCES "MealItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
