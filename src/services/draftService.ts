import {
    ChatStateType,
    DraftItemSourceType,
    DraftParsedBy,
    DraftStatus,
} from '@prisma/client';
import { prisma } from '../db/prisma';
import { getUserByTelegramId } from './userService';
import { updateUserChatState } from './chatStateService';
import { addMealFromParsedItems } from './mealService';

type DraftItemInput = {
    name: string;
    estimatedGrams?: number;
    isApproximate?: boolean;
    sourceType?: DraftItemSourceType;
};

export async function createMealDraft(params: {
    telegramId: number;
    sourceText: string;
    mealType?: string;
    parsedBy: DraftParsedBy;
    confidence?: number;
    comment?: string;
    items: DraftItemInput[];
}) {
    const user = await getUserByTelegramId(params.telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    await prisma.mealDraft.updateMany({
        where: {
            userId: user.id,
            status: DraftStatus.PENDING,
        },
        data: {
            status: DraftStatus.CANCELLED,
        },
    });

    const draft = await prisma.mealDraft.create({
        data: {
            userId: user.id,
            sourceText: params.sourceText,
            mealType: params.mealType,
            parsedBy: params.parsedBy,
            confidence: params.confidence,
            comment: params.comment,
            items: {
                create: params.items.map((item, index) => ({
                    name: item.name,
                    estimatedGrams: item.estimatedGrams,
                    isApproximate: item.isApproximate ?? true,
                    sourceType: item.sourceType ?? DraftItemSourceType.DIRECT,
                    position: index,
                })),
            },
        },
        include: {
            items: {
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    await updateUserChatState({
        telegramId: params.telegramId,
        state: ChatStateType.WAITING_CONFIRMATION,
        activeDraftId: draft.id,
        lastMessage: params.sourceText,
    });

    return draft;
}

export async function getActiveDraft(telegramId: number) {
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    return prisma.mealDraft.findFirst({
        where: {
            userId: user.id,
            status: DraftStatus.PENDING,
        },
        include: {
            items: {
                orderBy: {
                    position: 'asc',
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
}

export async function cancelActiveDraft(telegramId: number) {
    const draft = await getActiveDraft(telegramId);

    if (!draft) {
        return null;
    }

    const cancelled = await prisma.mealDraft.update({
        where: {
            id: draft.id,
        },
        data: {
            status: DraftStatus.CANCELLED,
        },
        include: {
            items: {
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    await updateUserChatState({
        telegramId,
        state: ChatStateType.IDLE,
        activeDraftId: null,
        lastMessage: null,
    });

    return cancelled;
}

export async function appendItemsToActiveDraft(params: {
    telegramId: number;
    items: DraftItemInput[];
    comment?: string;
}) {
    const draft = await getActiveDraft(params.telegramId);

    if (!draft) {
        return null;
    }

    const currentCount = draft.items.length;

    await prisma.mealDraftItem.createMany({
        data: params.items.map((item, index) => ({
            draftId: draft.id,
            name: item.name,
            estimatedGrams: item.estimatedGrams,
            isApproximate: item.isApproximate ?? true,
            sourceType: item.sourceType ?? DraftItemSourceType.DIRECT,
            position: currentCount + index,
        })),
    });

    const updatedDraft = await prisma.mealDraft.update({
        where: {
            id: draft.id,
        },
        data: {
            comment: params.comment ?? draft.comment,
        },
        include: {
            items: {
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    await updateUserChatState({
        telegramId: params.telegramId,
        state: ChatStateType.WAITING_CONFIRMATION,
        activeDraftId: draft.id,
        lastMessage: null,
    });

    return updatedDraft;
}

export async function replaceActiveDraftItems(params: {
    telegramId: number;
    items: DraftItemInput[];
    comment?: string;
}) {
    const draft = await getActiveDraft(params.telegramId);

    if (!draft) {
        return null;
    }

    await prisma.mealDraftItem.deleteMany({
        where: {
            draftId: draft.id,
        },
    });

    await prisma.mealDraftItem.createMany({
        data: params.items.map((item, index) => ({
            draftId: draft.id,
            name: item.name,
            estimatedGrams: item.estimatedGrams,
            isApproximate: item.isApproximate ?? true,
            sourceType: item.sourceType ?? DraftItemSourceType.CORRECTED,
            position: index,
        })),
    });

    const updatedDraft = await prisma.mealDraft.update({
        where: {
            id: draft.id,
        },
        data: {
            comment: params.comment ?? draft.comment,
        },
        include: {
            items: {
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    await updateUserChatState({
        telegramId: params.telegramId,
        state: ChatStateType.WAITING_CONFIRMATION,
        activeDraftId: draft.id,
        lastMessage: null,
    });

    return updatedDraft;
}

export async function confirmActiveDraft(telegramId: number) {
    const draft = await getActiveDraft(telegramId);

    if (!draft) {
        return null;
    }

    const rawInput = draft.items
        .map((item) => {
            if (item.estimatedGrams != null) {
                return `${item.name} ${item.isApproximate ? '~' : ''}${item.estimatedGrams} г`;
            }

            return item.name;
        })
        .join('\n');

    const meal = await addMealFromParsedItems({
        telegramId,
        rawInput,
        mealType: draft.mealType ?? undefined,
        title: draft.mealType ?? undefined,
        items: draft.items.map((item) => ({
            productName: item.name,
            amountValue: item.estimatedGrams ?? undefined,
            amountUnit: item.estimatedGrams != null ? 'г' : undefined,
            isApproximate: item.isApproximate,
            rawText:
                item.estimatedGrams != null
                    ? `${item.name} ${item.isApproximate ? '~' : ''}${item.estimatedGrams} г`
                    : item.name,
        })),
    });

    await prisma.mealDraft.update({
        where: {
            id: draft.id,
        },
        data: {
            status: DraftStatus.CONFIRMED,
        },
    });

    await updateUserChatState({
        telegramId,
        state: ChatStateType.IDLE,
        activeDraftId: null,
        lastMessage: null,
    });

    return {
        draft,
        meal,
    };
}