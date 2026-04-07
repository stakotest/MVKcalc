import { Markup } from 'telegraf';
import { BUTTONS } from '../../constants/buttons';

export function getReportsKeyboard() {
    return Markup.keyboard([
        [BUTTONS.DAILY_REPORT, BUTTONS.WEEKLY_REPORT],
        [BUTTONS.MONTHLY_REPORT],
        [BUTTONS.BACK],
    ]).resize();
}