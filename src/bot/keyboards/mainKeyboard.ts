import { Markup } from 'telegraf';
import { BUTTONS } from '../../constants/buttons';

export function getMainKeyboard() {
    return Markup.keyboard([
        [BUTTONS.ADD_MEAL, BUTTONS.REPORTS],
        [BUTTONS.MY_NORMS, BUTTONS.PRODUCT_NUTRIENTS],
        [BUTTONS.ACTIONS, BUTTONS.HELP],
    ]).resize();
}