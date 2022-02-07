import TelegramBot from "node-telegram-bot-api";
import { ICommand, ICommandContext } from "../helpers/command";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";

export const helpCommand: ICommand = {
    name: "help",
    description: "Shows a little presentation message and a list of all commands",

    callback: async (context: ICommandContext): Promise<void> => {
        await context.replyMessageAsync(buildHelpMessage(), { parse_mode: "HTML" });
    }
};

function buildHelpMessage(): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendNewLines(1);
    messageBuilder.appendTitle("Help");

    messageBuilder.appendLine(`Hey! I'm still under construction, but my owner is working hard on implementing new features.`);
    messageBuilder.appendNewLines(1);

    messageBuilder.appendLineInTags("Helpful commands:", "b");
    messageBuilder.appendLine("- /info: Gives you informations about a substance");
    messageBuilder.appendLine("- /effects: Gives you effects given by a substance");
    messageBuilder.appendLine("- /combos: Gives you combos for a substance");

    return messageBuilder.getContent();
}