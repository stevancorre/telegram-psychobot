import { IMessageBuilder, MessageBuilder } from "../messages/messageBuilder";
import { CommandCallback, ICommandContext } from "./command";

export const executeHelpCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendTitle("Help");

    messageBuilder.appendLine(`Hey! I'm still under construction, but my owner is working hard on implementing new features.`);
    messageBuilder.appendNewLines(1);

    messageBuilder.appendLineInTags("Helpful commands", "b");
    messageBuilder.appendLine("- /breathe: Sends a GIF to help you breathing");
    messageBuilder.appendLine("- /info &lt;drug>: Give you informations about a specific drug");

    await context.replyMessageAsync(messageBuilder.getContent(), "HTML"); // table tennis emoji
}