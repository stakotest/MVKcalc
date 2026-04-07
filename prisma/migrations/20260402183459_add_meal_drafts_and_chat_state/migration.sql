-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DraftParsedBy" AS ENUM ('RULES', 'AI');

-- CreateEnum
CREATE TYPE "DraftItemSourceType" AS ENUM ('DIRECT', 'DECOMPOSED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "ChatStateType" AS ENUM ('IDLE', 'WAITING_CONFIRMATION', 'WAITING_EDIT');

-- CreateTable
CREATE TABLE "MealDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "mealType" TEXT,
    "status" "DraftStatus" NOT NULL DEFAULT 'PENDING',
    "parsedBy" "DraftParsedBy" NOT NULL,
    "confidence" DOUBLE PRECISION,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealDraftItem" (
    "id" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "estimatedGrams" DOUBLE PRECISION,
    "isApproximate" BOOLEAN NOT NULL DEFAULT true,
    "sourceType" "DraftItemSourceType" NOT NULL DEFAULT 'DIRECT',
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealDraftItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeDraftId" TEXT,
    "state" "ChatStateType" NOT NULL DEFAULT 'IDLE',
    "lastMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserChatState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MealDraft_userId_status_idx" ON "MealDraft"("userId", "status");

-- CreateIndex
CREATE INDEX "MealDraftItem_draftId_idx" ON "MealDraftItem"("draftId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChatState_userId_key" ON "UserChatState"("userId");

-- AddForeignKey
ALTER TABLE "MealDraft" ADD CONSTRAINT "MealDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDraftItem" ADD CONSTRAINT "MealDraftItem_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "MealDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatState" ADD CONSTRAINT "UserChatState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatState" ADD CONSTRAINT "UserChatState_activeDraftId_fkey" FOREIGN KEY ("activeDraftId") REFERENCES "MealDraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
