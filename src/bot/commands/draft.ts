import { Context } from 'telegraf';
import { handleShowActiveDraft } from '../handlers/draftActions';

export async function draftCommand(ctx: Context) {
    await handleShowActiveDraft(ctx);
}