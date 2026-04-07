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
    | 'FOLATE';

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
    { code: 'VITAMIN_C', name: 'Vitamin C', unit: 'mg' },
    { code: 'VITAMIN_D', name: 'Vitamin D', unit: 'µg' },
    { code: 'VITAMIN_B12', name: 'Vitamin B12', unit: 'µg' },
    { code: 'FOLATE', name: 'Folate', unit: 'µg' },
];