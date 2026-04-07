import { NUTRIENT_TRANSLATIONS } from '../constants/nutrientTranslations';

export function translateNutrient(code: string, fallbackName: string) {
    return NUTRIENT_TRANSLATIONS[code] ?? fallbackName;
}