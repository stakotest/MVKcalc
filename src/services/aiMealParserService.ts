import OpenAI from 'openai';
import { z } from 'zod';
import { DraftItemSourceType, DraftParsedBy } from '@prisma/client';
import { env } from '../config/env';
import { resolveMealTypeFromCurrentTime } from '../utils/mealTypeResolver';

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

const aiMealSchema = z.object({
    mealType: z.string().optional(),
    comment: z.string().optional(),
    confidence: z.number().min(0).max(1).optional(),
    items: z.array(
        z.object({
            name: z.string().min(1),
            estimatedGrams: z.number().positive(),
            isApproximate: z.boolean().optional(),
            sourceType: z.enum(['DIRECT', 'DECOMPOSED', 'CORRECTED']).optional(),
        })
    ),
});

type AiMealParseResult = {
    parsedBy: DraftParsedBy;
    confidence: number;
    mealType: string;
    comment?: string;
    items: Array<{
        name: string;
        estimatedGrams: number;
        isApproximate: boolean;
        sourceType: DraftItemSourceType;
    }>;
};

export type AiMealParseResponse =
    | {
    ok: true;
    data: AiMealParseResult;
}
    | {
    ok: false;
    reason:
        | 'NO_API_KEY'
        | 'INSUFFICIENT_QUOTA'
        | 'RATE_LIMIT'
        | 'INVALID_JSON'
        | 'INVALID_SCHEMA'
        | 'EMPTY_RESPONSE'
        | 'UNKNOWN_ERROR';
    message: string;
};

function cleanupMealType(mealType?: string): string {
    if (!mealType) {
        return resolveMealTypeFromCurrentTime();
    }

    const normalized = mealType.trim().toLowerCase();

    if (normalized.includes('завт')) {
        return 'Завтрак';
    }

    if (normalized.includes('обед')) {
        return 'Обед';
    }

    if (normalized.includes('ужин')) {
        return 'Ужин';
    }

    if (normalized.includes('позд')) {
        return 'Поздний прием пищи';
    }

    return resolveMealTypeFromCurrentTime();
}

export async function parseMealDraftByAI(text: string): Promise<AiMealParseResponse> {
    if (!env.OPENAI_API_KEY) {
        return {
            ok: false,
            reason: 'NO_API_KEY',
            message: 'OPENAI_API_KEY не задан в .env',
        };
    }

    const prompt = `
Ты разбираешь сообщение пользователя о еде в структурированный JSON.

КРИТИЧЕСКИ ВАЖНО:
- Для КАЖДОГО элемента items обязательно укажи estimatedGrams.
- estimatedGrams обязателен всегда.
- Если пользователь не указал вес точно, оцени его приблизительно.
- Если это сложное блюдо, разложи его на типичные ингредиенты и распредели общий вес между ними.
- Сумма estimatedGrams должна быть разумно близка к общему весу блюда, если он указан.
- Не пиши никаких объяснений вне JSON.

sourceType:
- DIRECT: если пользователь прямо указал продукт
- DECOMPOSED: если это ингредиент, полученный из блюда
- CORRECTED: здесь не использовать

mealType:
- Завтрак
- Обед
- Ужин
- Поздний прием пищи

Верни только JSON строго такого вида:
{
  "mealType": "Обед",
  "comment": "краткий комментарий",
  "confidence": 0.82,
  "items": [
    {
      "name": "рис",
      "estimatedGrams": 180,
      "isApproximate": true,
      "sourceType": "DECOMPOSED"
    }
  ]
}

Сообщение пользователя:
"${text}"
`.trim();

    try {
        const response = await openai.responses.create({
            model: 'gpt-5.4',
            input: prompt,
        });

        const outputText = response.output_text?.trim();

        if (!outputText) {
            return {
                ok: false,
                reason: 'EMPTY_RESPONSE',
                message: 'AI не вернул текст ответа',
            };
        }

        let parsedJson: unknown;

        try {
            parsedJson = JSON.parse(outputText);
        } catch {
            return {
                ok: false,
                reason: 'INVALID_JSON',
                message: 'AI вернул невалидный JSON',
            };
        }

        const result = aiMealSchema.safeParse(parsedJson);

        if (!result.success) {
            return {
                ok: false,
                reason: 'INVALID_SCHEMA',
                message: 'AI вернул JSON не по ожидаемой схеме',
            };
        }

        const items = result.data.items
            .map((item) => ({
                name: item.name.trim(),
                estimatedGrams: Number(item.estimatedGrams),
                isApproximate: item.isApproximate ?? true,
                sourceType:
                    (item.sourceType as DraftItemSourceType | undefined) ??
                    DraftItemSourceType.DECOMPOSED,
            }))
            .filter((item) => item.name.length > 0 && item.estimatedGrams > 0);

        if (!items.length) {
            return {
                ok: false,
                reason: 'INVALID_SCHEMA',
                message: 'AI не вернул ни одного элемента еды',
            };
        }

        return {
            ok: true,
            data: {
                parsedBy: DraftParsedBy.AI,
                confidence: result.data.confidence ?? 0.75,
                mealType: cleanupMealType(result.data.mealType),
                comment: result.data.comment,
                items,
            },
        };
    } catch (error: any) {
        const apiCode = error?.code ?? error?.error?.code;
        const status = error?.status;

        if (status === 429 && apiCode === 'insufficient_quota') {
            return {
                ok: false,
                reason: 'INSUFFICIENT_QUOTA',
                message: 'Недостаточно API-квоты OpenAI',
            };
        }

        if (status === 429) {
            return {
                ok: false,
                reason: 'RATE_LIMIT',
                message: 'OpenAI временно ограничил запросы',
            };
        }

        console.error('AI meal parser error:', error);

        return {
            ok: false,
            reason: 'UNKNOWN_ERROR',
            message: 'Неизвестная ошибка AI parser',
        };
    }
}