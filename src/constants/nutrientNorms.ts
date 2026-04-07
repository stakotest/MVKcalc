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
        { nutrientCode: 'SELENIUM', nutrientName: 'Selenium', unit: 'µg', amount: 55 },
        { nutrientCode: 'COPPER', nutrientName: 'Copper', unit: 'mg', amount: 0.9 },
        { nutrientCode: 'MANGANESE', nutrientName: 'Manganese', unit: 'mg', amount: 2.3 },
        { nutrientCode: 'PHOSPHORUS', nutrientName: 'Phosphorus', unit: 'mg', amount: 700 },
        { nutrientCode: 'SODIUM', nutrientName: 'Sodium', unit: 'mg', amount: 1500 },

        { nutrientCode: 'VITAMIN_C', nutrientName: 'Vitamin C', unit: 'mg', amount: 90 },
        { nutrientCode: 'VITAMIN_D', nutrientName: 'Vitamin D', unit: 'µg', amount: 15 },
        { nutrientCode: 'VITAMIN_B12', nutrientName: 'Vitamin B12', unit: 'µg', amount: 2.4 },
        { nutrientCode: 'FOLATE', nutrientName: 'Folate', unit: 'µg', amount: 400 },
        { nutrientCode: 'VITAMIN_A', nutrientName: 'Vitamin A', unit: 'µg', amount: 900 },
        { nutrientCode: 'VITAMIN_E', nutrientName: 'Vitamin E', unit: 'mg', amount: 15 },
        { nutrientCode: 'VITAMIN_K', nutrientName: 'Vitamin K', unit: 'µg', amount: 120 },
        { nutrientCode: 'VITAMIN_B1', nutrientName: 'Vitamin B1', unit: 'mg', amount: 1.2 },
        { nutrientCode: 'VITAMIN_B2', nutrientName: 'Vitamin B2', unit: 'mg', amount: 1.3 },
        { nutrientCode: 'VITAMIN_B3', nutrientName: 'Vitamin B3', unit: 'mg', amount: 16 },
        { nutrientCode: 'VITAMIN_B5', nutrientName: 'Vitamin B5', unit: 'mg', amount: 5 },
        { nutrientCode: 'VITAMIN_B6', nutrientName: 'Vitamin B6', unit: 'mg', amount: 1.3 },
    ],
    FEMALE: [
        { nutrientCode: 'FIBER', nutrientName: 'Fiber', unit: 'g', amount: 25 },
        { nutrientCode: 'CALCIUM', nutrientName: 'Calcium', unit: 'mg', amount: 1000 },
        { nutrientCode: 'IRON', nutrientName: 'Iron', unit: 'mg', amount: 18 },
        { nutrientCode: 'MAGNESIUM', nutrientName: 'Magnesium', unit: 'mg', amount: 310 },
        { nutrientCode: 'POTASSIUM', nutrientName: 'Potassium', unit: 'mg', amount: 2600 },
        { nutrientCode: 'ZINC', nutrientName: 'Zinc', unit: 'mg', amount: 8 },
        { nutrientCode: 'SELENIUM', nutrientName: 'Selenium', unit: 'µg', amount: 55 },
        { nutrientCode: 'COPPER', nutrientName: 'Copper', unit: 'mg', amount: 0.9 },
        { nutrientCode: 'MANGANESE', nutrientName: 'Manganese', unit: 'mg', amount: 1.8 },
        { nutrientCode: 'PHOSPHORUS', nutrientName: 'Phosphorus', unit: 'mg', amount: 700 },
        { nutrientCode: 'SODIUM', nutrientName: 'Sodium', unit: 'mg', amount: 1500 },

        { nutrientCode: 'VITAMIN_C', nutrientName: 'Vitamin C', unit: 'mg', amount: 75 },
        { nutrientCode: 'VITAMIN_D', nutrientName: 'Vitamin D', unit: 'µg', amount: 15 },
        { nutrientCode: 'VITAMIN_B12', nutrientName: 'Vitamin B12', unit: 'µg', amount: 2.4 },
        { nutrientCode: 'FOLATE', nutrientName: 'Folate', unit: 'µg', amount: 400 },
        { nutrientCode: 'VITAMIN_A', nutrientName: 'Vitamin A', unit: 'µg', amount: 700 },
        { nutrientCode: 'VITAMIN_E', nutrientName: 'Vitamin E', unit: 'mg', amount: 15 },
        { nutrientCode: 'VITAMIN_K', nutrientName: 'Vitamin K', unit: 'µg', amount: 90 },
        { nutrientCode: 'VITAMIN_B1', nutrientName: 'Vitamin B1', unit: 'mg', amount: 1.1 },
        { nutrientCode: 'VITAMIN_B2', nutrientName: 'Vitamin B2', unit: 'mg', amount: 1.1 },
        { nutrientCode: 'VITAMIN_B3', nutrientName: 'Vitamin B3', unit: 'mg', amount: 14 },
        { nutrientCode: 'VITAMIN_B5', nutrientName: 'Vitamin B5', unit: 'mg', amount: 5 },
        { nutrientCode: 'VITAMIN_B6', nutrientName: 'Vitamin B6', unit: 'mg', amount: 1.3 },
    ],
    OTHER: [
        { nutrientCode: 'FIBER', nutrientName: 'Fiber', unit: 'g', amount: 27 },
        { nutrientCode: 'CALCIUM', nutrientName: 'Calcium', unit: 'mg', amount: 1000 },
        { nutrientCode: 'IRON', nutrientName: 'Iron', unit: 'mg', amount: 12 },
        { nutrientCode: 'MAGNESIUM', nutrientName: 'Magnesium', unit: 'mg', amount: 355 },
        { nutrientCode: 'POTASSIUM', nutrientName: 'Potassium', unit: 'mg', amount: 3000 },
        { nutrientCode: 'ZINC', nutrientName: 'Zinc', unit: 'mg', amount: 9 },
        { nutrientCode: 'SELENIUM', nutrientName: 'Selenium', unit: 'µg', amount: 55 },
        { nutrientCode: 'COPPER', nutrientName: 'Copper', unit: 'mg', amount: 0.9 },
        { nutrientCode: 'MANGANESE', nutrientName: 'Manganese', unit: 'mg', amount: 2.0 },
        { nutrientCode: 'PHOSPHORUS', nutrientName: 'Phosphorus', unit: 'mg', amount: 700 },
        { nutrientCode: 'SODIUM', nutrientName: 'Sodium', unit: 'mg', amount: 1500 },

        { nutrientCode: 'VITAMIN_C', nutrientName: 'Vitamin C', unit: 'mg', amount: 82 },
        { nutrientCode: 'VITAMIN_D', nutrientName: 'Vitamin D', unit: 'µg', amount: 15 },
        { nutrientCode: 'VITAMIN_B12', nutrientName: 'Vitamin B12', unit: 'µg', amount: 2.4 },
        { nutrientCode: 'FOLATE', nutrientName: 'Folate', unit: 'µg', amount: 400 },
        { nutrientCode: 'VITAMIN_A', nutrientName: 'Vitamin A', unit: 'µg', amount: 800 },
        { nutrientCode: 'VITAMIN_E', nutrientName: 'Vitamin E', unit: 'mg', amount: 15 },
        { nutrientCode: 'VITAMIN_K', nutrientName: 'Vitamin K', unit: 'µg', amount: 105 },
        { nutrientCode: 'VITAMIN_B1', nutrientName: 'Vitamin B1', unit: 'mg', amount: 1.15 },
        { nutrientCode: 'VITAMIN_B2', nutrientName: 'Vitamin B2', unit: 'mg', amount: 1.2 },
        { nutrientCode: 'VITAMIN_B3', nutrientName: 'Vitamin B3', unit: 'mg', amount: 15 },
        { nutrientCode: 'VITAMIN_B5', nutrientName: 'Vitamin B5', unit: 'mg', amount: 5 },
        { nutrientCode: 'VITAMIN_B6', nutrientName: 'Vitamin B6', unit: 'mg', amount: 1.3 },
    ],
};