import { ICommandContext, CommandCallback } from "./command";

/**
 * Executes the `/breath` command: sends a gif to help breathing
 * 
 * @param context The context in which the command is executed
 */
export const executeBreatheCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    await context.replyVideoAsync("https://i.imgur.com/xtwSfR0.gif");
}
