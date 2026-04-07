-- AlterTable
ALTER TABLE "FoodReference" ADD COLUMN     "hasNutritionData" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "FoodReference_name_idx" ON "FoodReference"("name");

-- CreateIndex
CREATE INDEX "FoodReference_canonicalName_idx" ON "FoodReference"("canonicalName");

-- CreateIndex
CREATE INDEX "FoodReference_hasNutritionData_idx" ON "FoodReference"("hasNutritionData");
