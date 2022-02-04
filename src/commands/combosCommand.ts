import rp from "request-promise";

import { IDictionary, Dictionary } from "../helpers/dictionary";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { ICommandContext, CommandCallback } from "./command";

import { interactionIcons, prettySubstanceNames, substanceAliases } from "../tables/tables";

const TRIPSIT_API_ENDPOINT: string = "http://tripbot.tripsit.me/api/tripsit/getDrug";

export const executeCombosCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    const substanceName: string = substanceAliases.tryGetValue(context.match[1], context.match[1]).replace(" ", "");
    const requestUri: string = `${TRIPSIT_API_ENDPOINT}?name=${substanceName}`;

    rp(requestUri)
        .then(async response => {
            if (response.err === true) {
                await context.replyMessageAsync(`Error fetching combos from TripSit: <b>${response.data.msg}</b>`, "HTML");
                return;
            }

            const responseData = JSON.parse(response).data[0];

            const rawCombos = responseData.combos;
            if (!rawCombos) {
                await context.replyMessageAsync(`Error getting <b>${substanceName}</b> combos from TripSit API`, "HTML");
                return;
            }

            const combos: IDictionary<string[]> = new Dictionary<string[]>();

            for (const substanceName in rawCombos) {
                if (rawCombos.hasOwnProperty(substanceName)) {
                    const prettySubstanceName: string = prettySubstanceNames.tryGetValue(substanceName, substanceName);
                    const status: string = rawCombos[substanceName].status;
                    const substances: string[] | undefined = combos.getValue(status);

                    if (!substances) {
                        combos.add(status, [prettySubstanceName]);
                    } else {
                        substances.push(prettySubstanceName);
                    }
                }
            }

            await context.replyMessageAsync(buildSubstanceCombosMessage(responseData.pretty_name, combos), "HTML");
        })
        .catch(async error => {
            console.log(error);
            await context.replyMessageAsync(`Error getting <b>${substanceName}</b> combos from TripSit API`, "HTML");
        });
}

export const executeHelpCombosCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/combos <drug>`");
    messageBuilder.appendLine("Example: `/combos ketamine`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

function buildSubstanceCombosMessage(substanceName: string, combos: IDictionary<string[]>): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendTitle(`${substanceName} combo information`);

    const order: string[] = ["Dangerous", "Unsafe", "Caution", "Low Risk & Decrease", "Low Risk & No Synergy", "Low Risk & Synergy"];
    for (const key of order) {
        const substances: string[] | null | undefined = combos.getValue(key);
        if (!substances) { continue; }

        const icon: string = interactionIcons.tryGetValue(key, "❔");
        const categoryBuilder: IMessageCategoryBuilder = new MessageCategoryBuilder(`${icon} ${key}`, "");

        categoryBuilder.appendLines(substances.map(x => `- ${x}`));

        messageBuilder.appendCategory(categoryBuilder);
    }

    return messageBuilder.getContent();
}