import { DraftItemSourceType, DraftParsedBy } from '@prisma/client';
import { parseFoodText } from '../utils/parseFoodText';
import { resolveMealTypeFromCurrentTime } from '../utils/mealTypeResolver';

type ParsedDraftItem = {
    name: string;
    estimatedGrams?: number;
    isApproximate: boolean;
    sourceType: DraftItemSourceType;
};

type ParsedDraftResult = {
    parsedBy: DraftParsedBy;
    confidence: number;
    mealType: string;
    comment?: string;
    items: ParsedDraftItem[];
};

const explicitMealTypes: Array<{ patterns: string[]; value: string }> = [
    { patterns: ['завтрак', 'на завтрак', 'утром'], value: 'Завтрак' },
    { patterns: ['обед', 'на обед', 'днем', 'днём'], value: 'Обед' },
    { patterns: ['ужин', 'на ужин', 'вечером'], value: 'Ужин' },
];

function detectMealType(text: string): string {
    const normalized = text.toLowerCase();

    for (const mealType of explicitMealTypes) {
        if (mealType.patterns.some((pattern) => normalized.includes(pattern))) {
            return mealType.value;
        }
    }

    return resolveMealTypeFromCurrentTime();
}

function cleanProductName(name: string): string {
    return name
        .replace(
            /\b(съел|съела|ел|ела|выпил|выпила|был|была|были|на|завтрак|обед|ужин|утром|вечером)\b/gi,
            ''
        )
        .replace(/\s+/g, ' ')
        .trim();
}

function isParsedDraftItem(value: ParsedDraftItem | null): value is ParsedDraftItem {
    return value !== null;
}

export function parseMealDraftByRules(text: string): ParsedDraftResult | null {
    const parsedItems = parseFoodText(text);

    if (!parsedItems.length) {
        return null;
    }

    const items: ParsedDraftItem[] = parsedItems
        .map((item): ParsedDraftItem | null => {
            const cleanName = cleanProductName(item.productName);

            if (!cleanName) {
                return null;
            }

            return {
                name: cleanName,
                estimatedGrams: item.amountValue,
                isApproximate: item.isApproximate || item.amountValue === undefined,
                sourceType: DraftItemSourceType.DIRECT,
            };
        })
        .filter(isParsedDraftItem);

    if (!items.length) {
        return null;
    }

    const approximateCount = items.filter((item) => item.isApproximate).length;

    return {
        parsedBy: DraftParsedBy.RULES,
        confidence: approximateCount > 0 ? 0.8 : 0.95,
        mealType: detectMealType(text),
        items,
    };
}