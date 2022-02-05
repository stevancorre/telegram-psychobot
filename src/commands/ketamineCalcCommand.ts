import { formatInt } from "../helpers/formatters";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { IWeight, parseWeight } from "../helpers/weightParser";
import { ICommandContext, CommandCallback } from "./command";

// TODO: implement validate data in each command ?

export const executeKetamineCalcCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    const weight: IWeight | undefined = parseWeight(context.match);
    if(!weight) {
        return await executeHelpKetamineCalcCommandAsync(context);
    }

    await context.replyMessageAsync(buildKetamineCalcMessage(weight), "HTML");
}

export const executeHelpKetamineCalcCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/ketaminecalc <weight> <kg|lbs>`");
    messageBuilder.appendLine("Example: `/ketaminecalc 70 kg`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

function buildKetamineCalcMessage(weight: IWeight): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`Ketamine dosage calculator for <u>${weight.full}</u>`);

    const insufflated: IMessageCategoryBuilder = new MessageCategoryBuilder("👃", "Insufflated");
    insufflated.appendField("Threshold", `${formatInt(weight.pounds * 0.1)}mg`);
    insufflated.appendField("Light", `${formatInt(weight.pounds * 0.15)}mg`);
    insufflated.appendField("Common", `${formatInt(weight.pounds * 0.3)}mg`);
    insufflated.appendField("Strong", `${formatInt(weight.pounds * 0.5)}mg - ${formatInt(weight.pounds * 0.75)}mg`);
    insufflated.appendField("K-hole", `${formatInt(weight.pounds)}mg`);

    const intramuscular: IMessageCategoryBuilder = new MessageCategoryBuilder("💉", "Intramuscular");
    intramuscular.appendField("Threshold", `${formatInt(weight.pounds * 0.1)}mg`);
    intramuscular.appendField("Light", `${formatInt(weight.pounds * 0.15)}mg`);
    intramuscular.appendField("Common", `${formatInt(weight.pounds * 0.2)}mg`);
    intramuscular.appendField("Strong", `${formatInt(weight.pounds * 0.5)}mg`);
    intramuscular.appendField("K-hole", `${formatInt(weight.pounds * 0.75)}mg`);
    intramuscular.appendField("Anesthetic", `${formatInt(weight.pounds)}mg`);

    const oral: IMessageCategoryBuilder = new MessageCategoryBuilder("💊", "Oral");
    oral.appendField("Threshold", `${formatInt(weight.pounds * 0.3)}mg`);
    oral.appendField("Light", `${formatInt(weight.pounds * 0.6)}mg`);
    oral.appendField("Common", `${formatInt(weight.pounds * 0.75)}mg - ${formatInt(weight.pounds * 2)}mg`);
    oral.appendField("Strong", `${formatInt(weight.pounds * 2)}mg - ${formatInt(weight.pounds * 2.5)}mg`);
    oral.appendField("K-hole", `${formatInt(weight.pounds * 3)}mg - ${formatInt(weight.pounds * 4)}mg`);

    const rectal: IMessageCategoryBuilder = new MessageCategoryBuilder("🚀", "Rectal");
    rectal.appendField("Threshold", `${formatInt(weight.pounds * 0.3)}mg`);
    rectal.appendField("Light", `${formatInt(weight.pounds * 0.6)}mg`);
    rectal.appendField("Common", `${formatInt(weight.pounds * 0.75)}mg - ${formatInt(weight.pounds * 2)}mg`);
    rectal.appendField("Strong", `${formatInt(weight.pounds * 2)}mg - ${formatInt(weight.pounds * 2.5)}mg`);
    rectal.appendField("K-hole", `${formatInt(weight.pounds * 3)}mg - ${formatInt(weight.pounds * 4)}mg`);

    messageBuilder.appendCategory(insufflated);
    messageBuilder.appendCategory(intramuscular);
    messageBuilder.appendCategory(oral);
    messageBuilder.appendCategory(rectal);

    return messageBuilder.getContent();
}