export type FoodDictionaryItem = {
    key: string;
    displayNameRu: string;
    lookupNameEn: string;
    fdcId?: number;
    aliases: string[];
};

export const FOOD_DICTIONARY: FoodDictionaryItem[] = [

    // КРУПЫ

    {
        key: 'rice',
        displayNameRu: 'рис',
        lookupNameEn: 'rice cooked',
        aliases: ['рис'],
    },

    {
        key: 'buckwheat',
        displayNameRu: 'гречка',
        lookupNameEn: 'buckwheat cooked',
        aliases: ['гречка'],
    },

    {
        key: 'bulgur',
        displayNameRu: 'булгур',
        lookupNameEn: 'bulgur cooked',
        aliases: ['булгур'],
    },

    {
        key: 'oatmeal',
        displayNameRu: 'овсянка',
        lookupNameEn: 'oatmeal cooked',
        aliases: ['овсянка', 'овсяные хлопья'],
    },

    {
        key: 'granola',
        displayNameRu: 'гранола',
        lookupNameEn: 'granola',
        aliases: ['гранола'],
    },

    {
        key: 'pasta',
        displayNameRu: 'макароны',
        lookupNameEn: 'pasta cooked',
        aliases: ['макароны', 'паста'],
    },

    // БОБОВЫЕ

    {
        key: 'lentils',
        displayNameRu: 'чечевица',
        lookupNameEn: 'lentils cooked',
        aliases: ['чечевица'],
    },

    {
        key: 'chickpeas',
        displayNameRu: 'нут',
        lookupNameEn: 'chickpeas cooked',
        aliases: ['нут'],
    },

    {
        key: 'hummus',
        displayNameRu: 'хумус',
        lookupNameEn: 'hummus',
        aliases: ['хумус'],
    },

    {
        key: 'peas',
        displayNameRu: 'горох',
        lookupNameEn: 'peas cooked',
        aliases: ['горох', 'гороховая каша'],
    },

    // МЯСО

    {
        key: 'chicken',
        displayNameRu: 'курица',
        lookupNameEn: 'chicken breast cooked',
        aliases: ['курица', 'куриное филе'],
    },

    {
        key: 'turkey',
        displayNameRu: 'индейка',
        lookupNameEn: 'turkey cooked',
        aliases: ['индейка', 'индюшка'],
    },

    {
        key: 'beef',
        displayNameRu: 'говядина',
        lookupNameEn: 'beef cooked',
        aliases: ['говядина'],
    },

    {
        key: 'veal',
        displayNameRu: 'телятина',
        lookupNameEn: 'veal cooked',
        aliases: ['телятина'],
    },

    {
        key: 'pork',
        displayNameRu: 'свинина',
        lookupNameEn: 'pork cooked',
        aliases: ['свинина'],
    },

    {
        key: 'bacon',
        displayNameRu: 'бекон',
        lookupNameEn: 'bacon',
        aliases: ['бекон'],
    },

    {
        key: 'ham',
        displayNameRu: 'хамон',
        lookupNameEn: 'prosciutto',
        aliases: ['хамон'],
    },

    {
        key: 'sausage',
        displayNameRu: 'сосиски',
        lookupNameEn: 'sausage',
        aliases: ['сосиски'],
    },

    {
        key: 'doctor_sausage',
        displayNameRu: 'докторская колбаса',
        lookupNameEn: 'bologna sausage',
        aliases: ['докторская колбаса'],
    },

    {
        key: 'lard',
        displayNameRu: 'сало',
        lookupNameEn: 'pork fat',
        aliases: ['сало'],
    },

    // РЫБА

    {
        key: 'salmon',
        displayNameRu: 'лосось',
        lookupNameEn: 'salmon cooked',
        aliases: ['лосось'],
    },

    {
        key: 'salmon_smoked',
        displayNameRu: 'лосось слабосоленый',
        lookupNameEn: 'salmon smoked',
        aliases: ['лосось слабосоленый'],
    },

    {
        key: 'seabass',
        displayNameRu: 'сибас',
        lookupNameEn: 'sea bass',
        aliases: ['сибас'],
    },

    {
        key: 'dorada',
        displayNameRu: 'дорадо',
        lookupNameEn: 'gilthead seabream',
        aliases: ['дорадо'],
    },

    {
        key: 'herring',
        displayNameRu: 'селедка',
        lookupNameEn: 'herring',
        aliases: ['селедка', 'селедка слабосоленая'],
    },

    {
        key: 'tuna_canned',
        displayNameRu: 'тунец консервированный',
        lookupNameEn: 'tuna canned',
        aliases: ['тунец', 'тунец консервированный'],
    },

    {
        key: 'cod_liver',
        displayNameRu: 'печень трески',
        lookupNameEn: 'cod liver canned',
        aliases: ['печень трески'],
    },

    // МОЛОЧНЫЕ

    {
        key: 'milk',
        displayNameRu: 'молоко',
        lookupNameEn: 'milk',
        aliases: ['молоко'],
    },

    {
        key: 'yogurt',
        displayNameRu: 'йогурт',
        lookupNameEn: 'yogurt plain',
        aliases: ['йогурт'],
    },

    {
        key: 'kefir',
        displayNameRu: 'кефир',
        lookupNameEn: 'kefir',
        aliases: ['кефир'],
    },

    {
        key: 'sour_cream',
        displayNameRu: 'сметана',
        lookupNameEn: 'sour cream',
        aliases: ['сметана'],
    },

    {
        key: 'feta',
        displayNameRu: 'сыр фета',
        lookupNameEn: 'feta cheese',
        aliases: ['сыр фета', 'фета'],
    },

    {
        key: 'cheese',
        displayNameRu: 'сыр',
        lookupNameEn: 'cheese',
        aliases: ['сыр', 'сыр твердый'],
    },

    {
        key: 'butter',
        displayNameRu: 'сливочное масло',
        lookupNameEn: 'butter',
        aliases: ['сливочное масло'],
    },

    {
        key: 'olive_oil',
        displayNameRu: 'оливковое масло',
        lookupNameEn: 'olive oil',
        aliases: ['оливковое масло'],
    },

    {
        key: 'vegetable_oil',
        displayNameRu: 'растительное масло',
        lookupNameEn: 'vegetable oil',
        aliases: ['растительное масло'],
    },

    // ХЛЕБ

    {
        key: 'bread_white',
        displayNameRu: 'белый хлеб',
        lookupNameEn: 'white bread',
        aliases: ['белый хлеб'],
    },

    {
        key: 'bread_black',
        displayNameRu: 'черный хлеб',
        lookupNameEn: 'rye bread',
        aliases: ['черный хлеб'],
    },

    // ОВОЩИ

    {
        key: 'potato',
        displayNameRu: 'картофель',
        lookupNameEn: 'potato cooked',
        aliases: ['картофель', 'картошка'],
    },

    {
        key: 'sweet_potato',
        displayNameRu: 'батат',
        lookupNameEn: 'sweet potato',
        aliases: ['батат'],
    },

    {
        key: 'cucumber',
        displayNameRu: 'огурец',
        lookupNameEn: 'cucumber',
        aliases: ['огурец'],
    },

    {
        key: 'pickles',
        displayNameRu: 'соленые огурцы',
        lookupNameEn: 'pickles',
        aliases: ['соленые огурцы'],
    },

    {
        key: 'tomato',
        displayNameRu: 'помидор',
        lookupNameEn: 'tomato',
        aliases: ['помидор'],
    },

    {
        key: 'bell_pepper',
        displayNameRu: 'перец сладкий',
        lookupNameEn: 'bell pepper',
        aliases: ['перец', 'перец сладкий'],
    },

    {
        key: 'zucchini',
        displayNameRu: 'кабачок',
        lookupNameEn: 'zucchini',
        aliases: ['кабачок'],
    },

    {
        key: 'eggplant',
        displayNameRu: 'баклажан',
        lookupNameEn: 'eggplant',
        aliases: ['баклажан'],
    },

    {
        key: 'onion',
        displayNameRu: 'лук',
        lookupNameEn: 'onion',
        aliases: ['лук'],
    },

    {
        key: 'garlic',
        displayNameRu: 'чеснок',
        lookupNameEn: 'garlic',
        aliases: ['чеснок'],
    },

    {
        key: 'carrot',
        displayNameRu: 'морковь',
        lookupNameEn: 'carrot',
        aliases: ['морковь', 'морковка'],
    },

    {
        key: 'beetroot',
        displayNameRu: 'свекла',
        lookupNameEn: 'beetroot',
        aliases: ['свекла'],
    },

    {
        key: 'cabbage',
        displayNameRu: 'капуста',
        lookupNameEn: 'cabbage',
        aliases: ['капуста', 'капуста белокачанная'],
    },

    {
        key: 'cabbage_peking',
        displayNameRu: 'пекинская капуста',
        lookupNameEn: 'napa cabbage',
        aliases: ['пекинская капуста'],
    },

    {
        key: 'seaweed',
        displayNameRu: 'морская капуста',
        lookupNameEn: 'seaweed',
        aliases: ['морская капуста', 'чука'],
    },

    {
        key: 'arugula',
        displayNameRu: 'рукола',
        lookupNameEn: 'arugula',
        aliases: ['рукола'],
    },

    {
        key: 'spinach',
        displayNameRu: 'шпинат',
        lookupNameEn: 'spinach',
        aliases: ['шпинат'],
    },

    {
        key: 'greens',
        displayNameRu: 'зелень',
        lookupNameEn: 'parsley',
        aliases: ['зелень', 'укроп', 'петрушка'],
    },

    // ГРИБЫ

    {
        key: 'champignons',
        displayNameRu: 'шампиньоны',
        lookupNameEn: 'champignon mushrooms',
        aliases: ['шампиньоны'],
    },

    // ФРУКТЫ

    {
        key: 'apple',
        displayNameRu: 'яблоко',
        lookupNameEn: 'apple',
        aliases: ['яблоко', 'яблоки'],
    },

    {
        key: 'banana',
        displayNameRu: 'банан',
        lookupNameEn: 'banana',
        aliases: ['банан', 'бананы'],
    },

    {
        key: 'pear',
        displayNameRu: 'груша',
        lookupNameEn: 'pear',
        aliases: ['груша', 'груши'],
    },

    {
        key: 'orange',
        displayNameRu: 'апельсин',
        lookupNameEn: 'orange',
        aliases: ['апельсин'],
    },

    {
        key: 'mandarin',
        displayNameRu: 'мандарин',
        lookupNameEn: 'tangerine',
        aliases: ['мандарин'],
    },

    {
        key: 'kiwi',
        displayNameRu: 'киви',
        lookupNameEn: 'kiwi',
        aliases: ['киви'],
    },

    {
        key: 'avocado',
        displayNameRu: 'авокадо',
        lookupNameEn: 'avocado',
        aliases: ['авокадо'],
    },

    {
        key: 'watermelon',
        displayNameRu: 'арбуз',
        lookupNameEn: 'watermelon',
        aliases: ['арбуз'],
    },

    {
        key: 'melon',
        displayNameRu: 'дыня',
        lookupNameEn: 'melon',
        aliases: ['дыня'],
    },

    {
        key: 'persimmon',
        displayNameRu: 'хурма',
        lookupNameEn: 'persimmon',
        aliases: ['хурма', 'шарон'],
    },

    // ЯГОДЫ

    {
        key: 'blueberries',
        displayNameRu: 'черника',
        lookupNameEn: 'blueberries',
        aliases: ['черника'],
    },

    {
        key: 'blueberries2',
        displayNameRu: 'голубика',
        lookupNameEn: 'blueberries',
        aliases: ['голубика'],
    },

    {
        key: 'strawberries',
        displayNameRu: 'клубника',
        lookupNameEn: 'strawberries',
        aliases: ['клубника'],
    },

    {
        key: 'raspberries',
        displayNameRu: 'малина',
        lookupNameEn: 'raspberries',
        aliases: ['малина'],
    },

    // ОРЕХИ

    {
        key: 'walnuts',
        displayNameRu: 'грецкие орехи',
        lookupNameEn: 'walnuts',
        aliases: ['грецкий орех', 'грецкие орехи'],
    },

    // НАПИТКИ

    {
        key: 'water',
        displayNameRu: 'вода',
        lookupNameEn: 'water',
        aliases: ['вода'],
    },

    {
        key: 'coffee',
        displayNameRu: 'кофе',
        lookupNameEn: 'coffee',
        aliases: ['кофе'],
    },

    {
        key: 'tea',
        displayNameRu: 'чай',
        lookupNameEn: 'tea',
        aliases: ['чай'],
    },

    {
        key: 'cola',
        displayNameRu: 'кола',
        lookupNameEn: 'cola',
        aliases: ['кола'],
    },

    {
        key: 'beer_na',
        displayNameRu: 'пиво безалкогольное',
        lookupNameEn: 'non alcoholic beer',
        aliases: ['пиво б/а', 'безалкогольное пиво'],
    },

];