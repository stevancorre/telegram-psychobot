import { ICommand, ICommandContext } from "../helpers/command";

export const breatheCommand: ICommand = {
    name: "breathe",
    description: "Sends a gif to help you focusing on your breathing",

    callback: async (context: ICommandContext): Promise<void> => {
        await context.replyVideoAsync("https://i.imgur.com/xtwSfR0.gif");
    }
};