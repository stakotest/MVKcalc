import { Telegraf } from 'telegraf';
import { env } from '../config/env';
import { startCommand } from './commands/start';
import { profileCommand } from './commands/profile';
import { eatCommand } from './commands/eat';
import { todayCommand } from './commands/today';
import { dayReportCommand } from './commands/dayReport';
import { weekReportCommand } from './commands/weekReport';
import { monthReportCommand } from './commands/monthReport';
import { draftCommand } from './commands/draft';
import { textMessageHandler } from './handlers/textMessage';
import { handleDraftCancel, handleDraftConfirm } from './handlers/draftActions';

export function createBot() {
    const bot = new Telegraf(env.BOT_TOKEN);

    bot.start(startCommand);
    bot.command('profile', profileCommand);
    bot.command('eat', eatCommand);
    bot.command('today', todayCommand);
    bot.command('day_report', dayReportCommand);
    bot.command('week_report', weekReportCommand);
    bot.command('month_report', monthReportCommand);
    bot.command('draft', draftCommand);

    bot.action('draft_confirm', handleDraftConfirm);
    bot.action('draft_cancel', handleDraftCancel);

    bot.on('text', textMessageHandler);

    return bot;
}