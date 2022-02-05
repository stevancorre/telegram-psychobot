import { formatInt } from "../helpers/formatters";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { ICommandContext, CommandCallback } from "./command";

// TODO: implement validate data in each command ?

export const executeKetamineCalcCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    if (context.match[2].toLowerCase() !== "kg" && context.match[2].toLowerCase() !== "lbs") {
        return await executeHelpKetamineCalcCommandAsync(context);
    }

    let userWeight: number = Number.parseFloat(context.match[1]);
    if (Number.isNaN(userWeight)) {
        return await executeHelpKetamineCalcCommandAsync(context);
    }

    if (context.match[2] === "kg") {
        userWeight *= 2.2;
    }

    const stringWeight: string = `${context.match[1]}${context.match[2]}`;
    await context.replyMessageAsync(buildKetamineCalcMessage(stringWeight, userWeight), "HTML");
}

export const executeHelpKetamineCalcCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/ketaminecalc <weight> <kg|lbs>`");
    messageBuilder.appendLine("Example: `/ketaminecalc 70 kg`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

function buildKetamineCalcMessage(userWeight: string, weightInLbs: number): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`Ketamine dosage calculator for <u>${userWeight}</u>`);

    const insufflated: IMessageCategoryBuilder = new MessageCategoryBuilder("👃", "Insufflated");
    insufflated.appendField("Threshold", `${formatInt(weightInLbs * 0.1)}mg`);
    insufflated.appendField("Light", `${formatInt(weightInLbs * 0.15)}mg`);
    insufflated.appendField("Common", `${formatInt(weightInLbs * 0.3)}mg`);
    insufflated.appendField("Strong", `${formatInt(weightInLbs * 0.5)}mg - ${formatInt(weightInLbs * 0.75)}mg`);
    insufflated.appendField("K-hole", `${formatInt(weightInLbs)}mg`);

    const intramuscular: IMessageCategoryBuilder = new MessageCategoryBuilder("💉", "Intramuscular");
    intramuscular.appendField("Threshold", `${formatInt(weightInLbs * 0.1)}mg`);
    intramuscular.appendField("Light", `${formatInt(weightInLbs * 0.15)}mg`);
    intramuscular.appendField("Common", `${formatInt(weightInLbs * 0.2)}mg`);
    intramuscular.appendField("Strong", `${formatInt(weightInLbs * 0.5)}mg`);
    intramuscular.appendField("K-hole", `${formatInt(weightInLbs * 0.75)}mg`);
    intramuscular.appendField("Anesthetic", `${formatInt(weightInLbs)}mg`);

    const oral: IMessageCategoryBuilder = new MessageCategoryBuilder("💊", "Oral");
    oral.appendField("Threshold", `${formatInt(weightInLbs * 0.3)}mg`);
    oral.appendField("Light", `${formatInt(weightInLbs * 0.6)}mg`);
    oral.appendField("Common", `${formatInt(weightInLbs * 0.75)}mg - ${formatInt(weightInLbs * 2)}mg`);
    oral.appendField("Strong", `${formatInt(weightInLbs * 2)}mg - ${formatInt(weightInLbs * 2.5)}mg`);
    oral.appendField("K-hole", `${formatInt(weightInLbs * 3)}mg - ${formatInt(weightInLbs * 4)}mg`);

    const rectal: IMessageCategoryBuilder = new MessageCategoryBuilder("🚀", "Rectal");
    rectal.appendField("Threshold", `${formatInt(weightInLbs * 0.3)}mg`);
    rectal.appendField("Light", `${formatInt(weightInLbs * 0.6)}mg`);
    rectal.appendField("Common", `${formatInt(weightInLbs * 0.75)}mg - ${formatInt(weightInLbs * 2)}mg`);
    rectal.appendField("Strong", `${formatInt(weightInLbs * 2)}mg - ${formatInt(weightInLbs * 2.5)}mg`);
    rectal.appendField("K-hole", `${formatInt(weightInLbs * 3)}mg - ${formatInt(weightInLbs * 4)}mg`);

    messageBuilder.appendCategory(insufflated);
    messageBuilder.appendCategory(intramuscular);
    messageBuilder.appendCategory(oral);
    messageBuilder.appendCategory(rectal);

    return messageBuilder.getContent();
}