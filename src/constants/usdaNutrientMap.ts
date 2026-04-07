export type UsdaMappedNutrientCode =
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

type NutrientMeta = {
    code: UsdaMappedNutrientCode;
    name: string;
    unit: string;
};

function normalize(name: string): string {
    return name.trim().toLowerCase();
}

export function mapUsdaNutrientName(rawName: string): NutrientMeta | null {
    const name = normalize(rawName);

    if (
        (name.includes('energy') && name.includes('kcal')) ||
        name === 'energy' ||
        name === 'energy (atwater general factors)' ||
        name === 'energy (atwater specific factors)'
    ) {
        return { code: 'ENERGY_KCAL', name: 'Energy', unit: 'kcal' };
    }

    if (name === 'protein') {
        return { code: 'PROTEIN', name: 'Protein', unit: 'g' };
    }

    if (
        name === 'total lipid (fat)' ||
        name === 'fat' ||
        name.includes('total lipid')
    ) {
        return { code: 'FAT', name: 'Fat', unit: 'g' };
    }

    if (
        name === 'carbohydrate, by difference' ||
        name === 'carbohydrates' ||
        name === 'carbohydrate'
    ) {
        return { code: 'CARBS', name: 'Carbohydrates', unit: 'g' };
    }

    if (
        name === 'fiber, total dietary' ||
        name === 'fiber' ||
        name === 'dietary fiber'
    ) {
        return { code: 'FIBER', name: 'Fiber', unit: 'g' };
    }

    if (name === 'calcium, ca' || name === 'calcium') {
        return { code: 'CALCIUM', name: 'Calcium', unit: 'mg' };
    }

    if (name === 'iron, fe' || name === 'iron') {
        return { code: 'IRON', name: 'Iron', unit: 'mg' };
    }

    if (name === 'magnesium, mg' || name === 'magnesium') {
        return { code: 'MAGNESIUM', name: 'Magnesium', unit: 'mg' };
    }

    if (name === 'potassium, k' || name === 'potassium') {
        return { code: 'POTASSIUM', name: 'Potassium', unit: 'mg' };
    }

    if (name === 'zinc, zn' || name === 'zinc') {
        return { code: 'ZINC', name: 'Zinc', unit: 'mg' };
    }

    if (name === 'selenium, se' || name === 'selenium') {
        return { code: 'SELENIUM', name: 'Selenium', unit: 'µg' };
    }

    if (name === 'copper, cu' || name === 'copper') {
        return { code: 'COPPER', name: 'Copper', unit: 'mg' };
    }

    if (name === 'manganese, mn' || name === 'manganese') {
        return { code: 'MANGANESE', name: 'Manganese', unit: 'mg' };
    }

    if (name === 'phosphorus, p' || name === 'phosphorus') {
        return { code: 'PHOSPHORUS', name: 'Phosphorus', unit: 'mg' };
    }

    if (name === 'sodium, na' || name === 'sodium') {
        return { code: 'SODIUM', name: 'Sodium', unit: 'mg' };
    }

    if (
        name === 'vitamin c, total ascorbic acid' ||
        name === 'vitamin c'
    ) {
        return { code: 'VITAMIN_C', name: 'Vitamin C', unit: 'mg' };
    }

    if (
        name === 'vitamin d (d2 + d3), micrograms' ||
        name === 'vitamin d' ||
        name.includes('vitamin d')
    ) {
        return { code: 'VITAMIN_D', name: 'Vitamin D', unit: 'µg' };
    }

    if (
        name === 'vitamin b-12' ||
        name === 'vitamin b12' ||
        name === 'b12'
    ) {
        return { code: 'VITAMIN_B12', name: 'Vitamin B12', unit: 'µg' };
    }

    if (
        name === 'folate, total' ||
        name === 'folate' ||
        name === 'folic acid'
    ) {
        return { code: 'FOLATE', name: 'Folate', unit: 'µg' };
    }

    if (
        name === 'vitamin a, rae' ||
        name === 'vitamin a' ||
        name.includes('vitamin a')
    ) {
        return { code: 'VITAMIN_A', name: 'Vitamin A', unit: 'µg' };
    }

    if (
        name === 'vitamin e (alpha-tocopherol)' ||
        name === 'vitamin e' ||
        name.includes('alpha-tocopherol')
    ) {
        return { code: 'VITAMIN_E', name: 'Vitamin E', unit: 'mg' };
    }

    if (
        name === 'vitamin k (phylloquinone)' ||
        name === 'vitamin k' ||
        name.includes('phylloquinone')
    ) {
        return { code: 'VITAMIN_K', name: 'Vitamin K', unit: 'µg' };
    }

    if (
        name === 'thiamin' ||
        name === 'vitamin b-1' ||
        name === 'vitamin b1'
    ) {
        return { code: 'VITAMIN_B1', name: 'Vitamin B1', unit: 'mg' };
    }

    if (
        name === 'riboflavin' ||
        name === 'vitamin b-2' ||
        name === 'vitamin b2'
    ) {
        return { code: 'VITAMIN_B2', name: 'Vitamin B2', unit: 'mg' };
    }

    if (
        name === 'niacin' ||
        name === 'vitamin b-3' ||
        name === 'vitamin b3'
    ) {
        return { code: 'VITAMIN_B3', name: 'Vitamin B3', unit: 'mg' };
    }

    if (
        name === 'pantothenic acid' ||
        name === 'vitamin b-5' ||
        name === 'vitamin b5'
    ) {
        return { code: 'VITAMIN_B5', name: 'Vitamin B5', unit: 'mg' };
    }

    if (
        name === 'vitamin b-6' ||
        name === 'vitamin b6' ||
        name === 'pyridoxine'
    ) {
        return { code: 'VITAMIN_B6', name: 'Vitamin B6', unit: 'mg' };
    }

    return null;
}