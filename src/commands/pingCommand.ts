import { CommandCallback, ICommandContext } from "./command";

export const executePingCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    await context.replyMessageAsync("Pong\\! 🏓", "MarkdownV2"); // table tennis emoji
}