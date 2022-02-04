import { ICommandContext, CommandCallback } from "./command";

export const executeBreatheCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    await context.replyVideoAsync("https://i.imgur.com/xtwSfR0.gif"); // table tennis emoji
}
