import { ICommandContext, CommandCallback } from "./command";

/**
 * Execute the `/ping` command: replies with `Pong! 🏓`
 * 
 * @param context The context in which the command is executed
 */
export const executePingCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    await context.replyMessageAsync("Pong\\! 🏓", "MarkdownV2"); // table tennis emoji
}