import { prisma } from '../db/prisma';

type EnsureTelegramUserInput = {
    telegramId: number;
    telegramUsername?: string;
    firstName?: string;
    lastName?: string;
};

type UpdateProfileInput = {
    telegramId: number;
    name?: string;
    age?: number;
    weightKg?: number;
    heightCm?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    activityLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    goal?: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT';
    timezone?: string;
};

export async function ensureTelegramUser(input: EnsureTelegramUserInput) {
    const telegramId = BigInt(input.telegramId);

    return prisma.user.upsert({
        where: { telegramId },
        update: {
            telegramUsername: input.telegramUsername,
            firstName: input.firstName,
            lastName: input.lastName,
        },
        create: {
            telegramId,
            telegramUsername: input.telegramUsername,
            firstName: input.firstName,
            lastName: input.lastName,
        },
    });
}

export async function getUserByTelegramId(telegramId: number) {
    return prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        include: { profile: true },
    });
}

export async function updateUserProfile(input: UpdateProfileInput) {
    const user = await getUserByTelegramId(input.telegramId);

    if (!user) {
        throw new Error('User not found');
    }

    return prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
            name: input.name,
            age: input.age,
            weightKg: input.weightKg,
            heightCm: input.heightCm,
            gender: input.gender,
            activityLevel: input.activityLevel,
            goal: input.goal,
            timezone: input.timezone,
        },
        create: {
            userId: user.id,
            name: input.name,
            age: input.age,
            weightKg: input.weightKg,
            heightCm: input.heightCm,
            gender: input.gender,
            activityLevel: input.activityLevel,
            goal: input.goal,
            timezone: input.timezone ?? 'Europe/Amsterdam',
        },
    });
}