export type ParsedFoodItem = {
    productName: string;
    amountValue?: number;
    amountUnit?: string;
    isApproximate: boolean;
    rawText: string;
};

function normalizeLine(line: string): string {
    return line
        .replace(/[()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function parseFoodText(input: string): ParsedFoodItem[] {
    const lines = input
        .split('\n')
        .map((line) => normalizeLine(line))
        .filter(Boolean);

    return lines.map((line) => {
        const approx = line.includes('~') || line.toLowerCase().includes('примерно');

        const match = line.match(
            /^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(г|гр|g|kg|кг|ml|мл|шт|pcs)?$/i
        );

        if (!match) {
            return {
                productName: line.replace('~', '').trim(),
                isApproximate: approx,
                rawText: line,
            };
        }

        const [, productName, amountRaw, unitRaw] = match;

        return {
            productName: productName.replace('~', '').trim(),
            amountValue: Number(amountRaw.replace(',', '.')),
            amountUnit: unitRaw?.toLowerCase(),
            isApproximate: approx,
            rawText: line,
        };
    });
}