import { DEFAULT_DAILY_NORMS, GenderType, NutrientNorm } from '../constants/nutrientNorms';
import { getUserByTelegramId } from './userService';

type ActivityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type GoalType = 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT';

function calculateBmr(params: {
    weightKg: number;
    heightCm: number;
    age: number;
    gender: GenderType;
}): number {
    const { weightKg, heightCm, age, gender } = params;

    if (gender === 'FEMALE') {
        return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

function getActivityMultiplier(activityLevel?: ActivityLevel | null): number {
    switch (activityLevel) {
        case 'LOW':
            return 1.2;
        case 'MEDIUM':
            return 1.55;
        case 'HIGH':
            return 1.75;
        default:
            return 1.2;
    }
}

function adjustCaloriesByGoal(calories: number, goal?: GoalType | null): number {
    switch (goal) {
        case 'LOSE_WEIGHT':
            return calories - 300;
        case 'GAIN_WEIGHT':
            return calories + 300;
        case 'MAINTAIN':
        default:
            return calories;
    }
}

function getProteinTarget(weightKg?: number | null, goal?: GoalType | null): number | null {
    if (!weightKg) {
        return null;
    }

    switch (goal) {
        case 'LOSE_WEIGHT':
            return weightKg * 1.8;
        case 'GAIN_WEIGHT':
            return weightKg * 1.8;
        case 'MAINTAIN':
        default:
            return weightKg * 1.4;
    }
}

function getFatTarget(calories: number): number {
    return (calories * 0.28) / 9;
}

function getCarbTarget(calories: number): number {
    return (calories * 0.47) / 4;
}

export async function getDailyTargetsForUser(telegramId: number) {
    const user = await getUserByTelegramId(telegramId);

    if (!user?.profile) {
        return null;
    }

    const profile = user.profile;
    const gender: GenderType = profile.gender ?? 'OTHER';

    const micronutrients: NutrientNorm[] = DEFAULT_DAILY_NORMS[gender];

    let caloriesTarget: number | null = null;
    let proteinTarget: number | null = null;
    let fatTarget: number | null = null;
    let carbTarget: number | null = null;

    if (
        profile.weightKg &&
        profile.heightCm &&
        profile.age
    ) {
        const bmr = calculateBmr({
            weightKg: profile.weightKg,
            heightCm: profile.heightCm,
            age: profile.age,
            gender,
        });

        const dailyCalories = adjustCaloriesByGoal(
            bmr * getActivityMultiplier(profile.activityLevel as ActivityLevel | null),
            profile.goal as GoalType | null
        );

        caloriesTarget = Number(dailyCalories.toFixed(0));
        proteinTarget = Number((getProteinTarget(profile.weightKg, profile.goal as GoalType | null) ?? 0).toFixed(1));
        fatTarget = Number(getFatTarget(dailyCalories).toFixed(1));
        carbTarget = Number(getCarbTarget(dailyCalories).toFixed(1));
    }

    return {
        caloriesTarget,
        proteinTarget,
        fatTarget,
        carbTarget,
        micronutrients,
    };
}