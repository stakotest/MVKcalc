import OpenAI from 'openai';
import { z } from 'zod';
import { DraftItemSourceType } from '@prisma/client';
import { env } from '../config/env';

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

const editDraftSchema = z.object({
    comment: z.string().optional(),
    items: z.array(
        z.object({
            name: z.string().min(1),
            estimatedGrams: z.number().positive(),
            isApproximate: z.boolean().optional(),
            sourceType: z.enum(['DIRECT', 'DECOMPOSED', 'CORRECTED']).optional(),
        })
    ),
});

export type AiDraftEditResponse =
    | {
    ok: true;
    data: {
        comment?: string;
        items: Array<{
            name: string;
            estimatedGrams: number;
            isApproximate: boolean;
            sourceType: DraftItemSourceType;
        }>;
    };
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

export async function editDraftByAI(params: {
    currentMealType?: string | null;
    currentComment?: string | null;
    currentItems: Array<{
        name: string;
        estimatedGrams?: number | null;
        isApproximate: boolean;
        sourceType: string;
    }>;
    userMessage: string;
}): Promise<AiDraftEditResponse> {
    if (!env.OPENAI_API_KEY) {
        return {
            ok: false,
            reason: 'NO_API_KEY',
            message: 'OPENAI_API_KEY не задан',
        };
    }

    const prompt = `
Ты редактируешь черновик приема пищи.

Текущий прием пищи:
${JSON.stringify(
        {
            mealType: params.currentMealType,
            comment: params.currentComment,
            items: params.currentItems,
        },
        null,
        2
    )}

Новое сообщение пользователя:
"${params.userMessage}"

Твоя задача:
1. Применить правку пользователя к текущему списку еды.
2. Вернуть ПОЛНЫЙ новый список items после правки.
3. Если пользователь пишет "убери", удали элемент.
4. Если пишет "добавь", добавь элемент.
5. Если меняет общий вес блюда, перераспредели веса разумно.
6. Для КАЖДОГО элемента обязательно укажи estimatedGrams.
7. Не добавляй лишний текст.
8. Верни только JSON вида:
{
  "comment": "краткое описание правки",
  "items": [
    {
      "name": "рис",
      "estimatedGrams": 180,
      "isApproximate": true,
      "sourceType": "CORRECTED"
    }
  ]
}
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

        const result = editDraftSchema.safeParse(parsedJson);

        if (!result.success) {
            return {
                ok: false,
                reason: 'INVALID_SCHEMA',
                message: 'AI вернул JSON не по схеме',
            };
        }

        const items = result.data.items
            .map((item) => ({
                name: item.name.trim(),
                estimatedGrams: Number(item.estimatedGrams),
                isApproximate: item.isApproximate ?? true,
                sourceType:
                    (item.sourceType as DraftItemSourceType | undefined) ??
                    DraftItemSourceType.CORRECTED,
            }))
            .filter((item) => item.name.length > 0 && item.estimatedGrams > 0);

        if (!items.length) {
            return {
                ok: false,
                reason: 'INVALID_SCHEMA',
                message: 'После правки не осталось ни одного элемента',
            };
        }

        return {
            ok: true,
            data: {
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

        console.error('AI draft editor error:', error);

        return {
            ok: false,
            reason: 'UNKNOWN_ERROR',
            message: 'Неизвестная ошибка AI draft editor',
        };
    }
}