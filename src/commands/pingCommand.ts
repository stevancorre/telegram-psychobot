import { ICommand, ICommandContext } from "../helpers/command";

export const pingCommand: ICommand = {
    name: "ping",
    description: "Checks if the bot is online",

    callback: async (context: ICommandContext): Promise<void> => {
        await context.replyMessageAsync("Pong\\! 🏓", { parse_mode: "MarkdownV2" }); // table tennis emoji
    }
};