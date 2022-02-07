import { ICommand, ICommandContext } from "../helpers/command";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { IWeight } from "../parsers/weightParser";
import { formatInt } from "../helpers/formatters";

interface IDxmCalcCommandArgs {
    weight: IWeight;
}

export const dxmCalcCommand: ICommand = {
    name: "dxmcalc",
    description: "Gives you dosages for DXM based on your weight",
    args: [
        {
            name: "weight",
            type: "weight",
            description: "Your weight"
        }
    ],

    callback: async (context: ICommandContext, argv: IDxmCalcCommandArgs): Promise<void> => {
        const dosages: string = buildDxmCalcMessage(argv.weight);
        await context.replyMessageAsync(dosages, { parse_mode: "HTML" });
    }
};

function buildDxmCalcMessage(weight: IWeight): string {
    const doseModifier = 2 * Math.log(weight.pounds) / Math.log(125) - 1;
    const lightMin: number = 100 * doseModifier;
    const lightMaxCommonMin: number = 200 * doseModifier;
    const commonMaxStrongMin: number = 400 * doseModifier;
    const strongMaxHeavy: number = 700 * doseModifier;

    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`DXM dosage calculator for <u>${weight.full}</u>`);

    const dosages: IMessageCategoryBuilder = new MessageCategoryBuilder("⚖️", "Dosages");
    dosages.appendField("First plateau", `${formatInt(lightMin)}mg - ${formatInt(lightMaxCommonMin)}mg`);
    dosages.appendField("Second plateau", `${formatInt(lightMaxCommonMin)}mg - ${formatInt(commonMaxStrongMin)}mg`);
    dosages.appendField("Third plateau", `${formatInt(commonMaxStrongMin)}mg - ${formatInt(strongMaxHeavy)}mg`);
    dosages.appendField("Fourth plateau", `${formatInt(strongMaxHeavy)}+mg`);

    const warning: IMessageCategoryBuilder = new MessageCategoryBuilder("⚠️", "Warning");
    warning.appendLine(`These recommendations are an approximation and are on the lower end for harm reduction purposes, please take into account your own personal tolerance and start with lower dosages. Doses exceeding 1500mg are potentially fatal.`);

    messageBuilder.appendCategory(dosages);
    messageBuilder.appendCategory(warning);

    return messageBuilder.getContent();
}