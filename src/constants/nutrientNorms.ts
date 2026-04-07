export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export type NutrientNorm = {
    nutrientCode: string;
    nutrientName: string;
    unit: string;
    amount: number;
};

export const DEFAULT_DAILY_NORMS: Record<GenderType, NutrientNorm[]> = {
    MALE: [
        { nutrientCode: 'FIBER', nutrientName: 'Fiber', unit: 'g', amount: 30 },
        { nutrientCode: 'CALCIUM', nutrientName: 'Calcium', unit: 'mg', amount: 1000 },
        { nutrientCode: 'IRON', nutrientName: 'Iron', unit: 'mg', amount: 8 },
        { nutrientCode: 'MAGNESIUM', nutrientName: 'Magnesium', unit: 'mg', amount: 400 },
        { nutrientCode: 'POTASSIUM', nutrientName: 'Potassium', unit: 'mg', amount: 3400 },
        { nutrientCode: 'ZINC', nutrientName: 'Zinc', unit: 'mg', amount: 11 },
        { nutrientCode: 'VITAMIN_C', nutrientName: 'Vitamin C', unit: 'mg', amount: 90 },
        { nutrientCode: 'VITAMIN_D', nutrientName: 'Vitamin D', unit: 'µg', amount: 15 },
        { nutrientCode: 'VITAMIN_B12', nutrientName: 'Vitamin B12', unit: 'µg', amount: 2.4 },
        { nutrientCode: 'FOLATE', nutrientName: 'Folate', unit: 'µg', amount: 400 },
    ],
    FEMALE: [
        { nutrientCode: 'FIBER', nutrientName: 'Fiber', unit: 'g', amount: 25 },
        { nutrientCode: 'CALCIUM', nutrientName: 'Calcium', unit: 'mg', amount: 1000 },
        { nutrientCode: 'IRON', nutrientName: 'Iron', unit: 'mg', amount: 18 },
        { nutrientCode: 'MAGNESIUM', nutrientName: 'Magnesium', unit: 'mg', amount: 310 },
        { nutrientCode: 'POTASSIUM', nutrientName: 'Potassium', unit: 'mg', amount: 2600 },
        { nutrientCode: 'ZINC', nutrientName: 'Zinc', unit: 'mg', amount: 8 },
        { nutrientCode: 'VITAMIN_C', nutrientName: 'Vitamin C', unit: 'mg', amount: 75 },
        { nutrientCode: 'VITAMIN_D', nutrientName: 'Vitamin D', unit: 'µg', amount: 15 },
        { nutrientCode: 'VITAMIN_B12', nutrientName: 'Vitamin B12', unit: 'µg', amount: 2.4 },
        { nutrientCode: 'FOLATE', nutrientName: 'Folate', unit: 'µg', amount: 400 },
    ],
    OTHER: [
        { nutrientCode: 'FIBER', nutrientName: 'Fiber', unit: 'g', amount: 27 },
        { nutrientCode: 'CALCIUM', nutrientName: 'Calcium', unit: 'mg', amount: 1000 },
        { nutrientCode: 'IRON', nutrientName: 'Iron', unit: 'mg', amount: 12 },
        { nutrientCode: 'MAGNESIUM', nutrientName: 'Magnesium', unit: 'mg', amount: 355 },
        { nutrientCode: 'POTASSIUM', nutrientName: 'Potassium', unit: 'mg', amount: 3000 },
        { nutrientCode: 'ZINC', nutrientName: 'Zinc', unit: 'mg', amount: 9 },
        { nutrientCode: 'VITAMIN_C', nutrientName: 'Vitamin C', unit: 'mg', amount: 82 },
        { nutrientCode: 'VITAMIN_D', nutrientName: 'Vitamin D', unit: 'µg', amount: 15 },
        { nutrientCode: 'VITAMIN_B12', nutrientName: 'Vitamin B12', unit: 'µg', amount: 2.4 },
        { nutrientCode: 'FOLATE', nutrientName: 'Folate', unit: 'µg', amount: 400 },
    ],
};