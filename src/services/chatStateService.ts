import { ChatStateType } from '@prisma/client';
import { prisma } from '../db/prisma';
import { getUserByTelegramId } from './userService';

export async function ensureUserChatState(telegramId: number) {
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    return prisma.userChatState.upsert({
        where: {
            userId: user.id,
        },
        update: {},
        create: {
            userId: user.id,
            state: ChatStateType.IDLE,
        },
        include: {
            activeDraft: {
                include: {
                    items: true,
                },
            },
        },
    });
}

export async function getUserChatState(telegramId: number) {
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    return prisma.userChatState.findUnique({
        where: {
            userId: user.id,
        },
        include: {
            activeDraft: {
                include: {
                    items: true,
                },
            },
        },
    });
}

export async function updateUserChatState(params: {
    telegramId: number;
    state: ChatStateType;
    activeDraftId?: string | null;
    lastMessage?: string | null;
}) {
    const user = await getUserByTelegramId(params.telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    return prisma.userChatState.upsert({
        where: {
            userId: user.id,
        },
        update: {
            state: params.state,
            activeDraftId: params.activeDraftId,
            lastMessage: params.lastMessage,
        },
        create: {
            userId: user.id,
            state: params.state,
            activeDraftId: params.activeDraftId,
            lastMessage: params.lastMessage,
        },
        include: {
            activeDraft: {
                include: {
                    items: true,
                },
            },
        },
    });
}

export async function resetUserChatState(telegramId: number) {
    return updateUserChatState({
        telegramId,
        state: ChatStateType.IDLE,
        activeDraftId: null,
        lastMessage: null,
    });
}