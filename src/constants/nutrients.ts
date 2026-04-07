export type SupportedNutrientCode =
    | 'ENERGY_KCAL'
    | 'PROTEIN'
    | 'FAT'
    | 'CARBS'
    | 'FIBER'
    | 'CALCIUM'
    | 'IRON'
    | 'MAGNESIUM'
    | 'POTASSIUM'
    | 'ZINC'
    | 'VITAMIN_C'
    | 'VITAMIN_D'
    | 'VITAMIN_B12'
    | 'FOLATE'
    | 'VITAMIN_A'
    | 'VITAMIN_E'
    | 'VITAMIN_K'
    | 'VITAMIN_B1'
    | 'VITAMIN_B2'
    | 'VITAMIN_B3'
    | 'VITAMIN_B5'
    | 'VITAMIN_B6'
    | 'SELENIUM'
    | 'COPPER'
    | 'MANGANESE'
    | 'PHOSPHORUS'
    | 'SODIUM';

export const SUPPORTED_NUTRIENTS: Array<{
    code: SupportedNutrientCode;
    name: string;
    unit: string;
}> = [
    { code: 'ENERGY_KCAL', name: 'Energy', unit: 'kcal' },
    { code: 'PROTEIN', name: 'Protein', unit: 'g' },
    { code: 'FAT', name: 'Fat', unit: 'g' },
    { code: 'CARBS', name: 'Carbohydrates', unit: 'g' },
    { code: 'FIBER', name: 'Fiber', unit: 'g' },

    { code: 'CALCIUM', name: 'Calcium', unit: 'mg' },
    { code: 'IRON', name: 'Iron', unit: 'mg' },
    { code: 'MAGNESIUM', name: 'Magnesium', unit: 'mg' },
    { code: 'POTASSIUM', name: 'Potassium', unit: 'mg' },
    { code: 'ZINC', name: 'Zinc', unit: 'mg' },
    { code: 'SELENIUM', name: 'Selenium', unit: 'µg' },
    { code: 'COPPER', name: 'Copper', unit: 'mg' },
    { code: 'MANGANESE', name: 'Manganese', unit: 'mg' },
    { code: 'PHOSPHORUS', name: 'Phosphorus', unit: 'mg' },
    { code: 'SODIUM', name: 'Sodium', unit: 'mg' },

    { code: 'VITAMIN_C', name: 'Vitamin C', unit: 'mg' },
    { code: 'VITAMIN_D', name: 'Vitamin D', unit: 'µg' },
    { code: 'VITAMIN_B12', name: 'Vitamin B12', unit: 'µg' },
    { code: 'FOLATE', name: 'Folate', unit: 'µg' },
    { code: 'VITAMIN_A', name: 'Vitamin A', unit: 'µg' },
    { code: 'VITAMIN_E', name: 'Vitamin E', unit: 'mg' },
    { code: 'VITAMIN_K', name: 'Vitamin K', unit: 'µg' },
    { code: 'VITAMIN_B1', name: 'Vitamin B1', unit: 'mg' },
    { code: 'VITAMIN_B2', name: 'Vitamin B2', unit: 'mg' },
    { code: 'VITAMIN_B3', name: 'Vitamin B3', unit: 'mg' },
    { code: 'VITAMIN_B5', name: 'Vitamin B5', unit: 'mg' },
    { code: 'VITAMIN_B6', name: 'Vitamin B6', unit: 'mg' },
];