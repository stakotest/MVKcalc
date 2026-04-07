import { Markup } from 'telegraf';
import { BUTTONS } from '../../constants/buttons';

export function getActionsKeyboard() {
    return Markup.keyboard([
        [BUTTONS.DELETE_LAST_MEAL],
        [BUTTONS.APPEND_LAST_MEAL, BUTTONS.EDIT_LAST_MEAL],
        [BUTTONS.BACK],
    ]).resize();
}