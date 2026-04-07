export type FoodDictionaryItem = {
    key: string;
    displayNameRu: string;
    lookupNameEn: string;
    fdcId?: number;
    aliases: string[];
};

export const FOOD_DICTIONARY: FoodDictionaryItem[] = [
    {
        key: 'apple',
        displayNameRu: 'яблоко',
        lookupNameEn: 'apple raw',
        fdcId: 171688,
        aliases: ['яблоко', 'яблоки', 'apple', 'apples'],
    },
    {
        key: 'banana',
        displayNameRu: 'банан',
        lookupNameEn: 'banana raw',
        fdcId: 173944,
        aliases: ['банан', 'бананы', 'banana', 'bananas'],
    },
    {
        key: 'mandarin',
        displayNameRu: 'мандарин',
        lookupNameEn: 'tangerine raw',
        fdcId: 169910,
        aliases: ['мандарин', 'мандарины', 'tangerine', 'mandarin', 'clementine'],
    },
    {
        key: 'orange',
        displayNameRu: 'апельсин',
        lookupNameEn: 'orange raw',
        fdcId: 169097,
        aliases: ['апельсин', 'апельсины', 'orange', 'oranges'],
    },
    {
        key: 'cucumber',
        displayNameRu: 'огурец',
        lookupNameEn: 'cucumber raw',
        fdcId: 168409,
        aliases: ['огурец', 'огурцы', 'cucumber'],
    },
    {
        key: 'tomato',
        displayNameRu: 'помидор',
        lookupNameEn: 'tomato raw',
        fdcId: 170457,
        aliases: ['помидор', 'помидоры', 'томат', 'tomato'],
    },
    {
        key: 'buckwheat',
        displayNameRu: 'гречка',
        lookupNameEn: 'buckwheat cooked',
        fdcId: 1102652,
        aliases: ['гречка', 'гречневая каша', 'buckwheat'],
    },
    {
        key: 'spinach',
        displayNameRu: 'шпинат',
        lookupNameEn: 'spinach raw',
        fdcId: 168462,
        aliases: ['шпинат', 'spinach'],
    },
    {
        key: 'french_fries',
        displayNameRu: 'картошка фри',
        lookupNameEn: 'french fries',
        fdcId: 167198,
        aliases: ['картошка фри', 'фри', 'french fries', 'fries'],
    },
    {
        key: 'rice',
        displayNameRu: 'рис',
        lookupNameEn: 'rice cooked',
        fdcId: 169757,
        aliases: ['рис', 'рис вареный', 'вареный рис', 'rice'],
    },
    {
        key: 'oatmeal',
        displayNameRu: 'овсянка',
        lookupNameEn: 'oatmeal cooked',
        fdcId: 1102645,
        aliases: ['овсянка', 'овсяные хлопья', 'oatmeal', 'oats'],
    },
    {
        key: 'bulgur',
        displayNameRu: 'булгур',
        lookupNameEn: 'bulgur cooked',
        fdcId: 170276,
        aliases: ['булгур', 'bulgur'],
    },
    {
        key: 'yogurt',
        displayNameRu: 'йогурт',
        lookupNameEn: 'yogurt plain',
        fdcId: 172204,
        aliases: ['йогурт', 'йогурты', 'yogurt'],
    },
    {
        key: 'chicken',
        displayNameRu: 'курица',
        lookupNameEn: 'chicken breast cooked',
        fdcId: 171077,
        aliases: ['курица', 'куриная грудка', 'chicken', 'chicken breast'],
    },
    {
        key: 'beef',
        displayNameRu: 'говядина',
        lookupNameEn: 'beef cooked',
        fdcId: 173948,
        aliases: ['говядина', 'beef'],
    },
    {
        key: 'carrot',
        displayNameRu: 'морковь',
        lookupNameEn: 'carrot raw',
        fdcId: 170393,
        aliases: ['морковь', 'морковка', 'carrot'],
    },
    {
        key: 'onion',
        displayNameRu: 'лук',
        lookupNameEn: 'onion raw',
        fdcId: 170000,
        aliases: ['лук', 'onion'],
    },
    {
        key: 'garlic',
        displayNameRu: 'чеснок',
        lookupNameEn: 'garlic raw',
        fdcId: 169230,
        aliases: ['чеснок', 'часнок', 'garlic'],
    },
    {
        key: 'bell_pepper',
        displayNameRu: 'перец сладкий',
        lookupNameEn: 'bell pepper raw',
        fdcId: 168577,
        aliases: ['перец салатный', 'сладкий перец', 'перец сладкий', 'болгарский перец', 'bell pepper'],
    },
    {
        key: 'olive_oil',
        displayNameRu: 'оливковое масло',
        lookupNameEn: 'olive oil',
        fdcId: 171413,
        aliases: ['масло оливковое', 'оливковое масло', 'olive oil'],
    },
    {
        key: 'vegetable_oil',
        displayNameRu: 'растительное масло',
        lookupNameEn: 'vegetable oil',
        fdcId: 171420,
        aliases: ['масло растительное', 'растительное масло', 'vegetable oil'],
    },
];