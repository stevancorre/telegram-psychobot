import rp from "request-promise";
import { Icon } from "../helpers/iconTable";
import { interactionIconTable } from "../helpers/interactionIconTable";
import { IIteratableTable, IteratableTable } from "../helpers/iteratableTable";
import { prettySubstanceNamesAliasTable } from "../helpers/prettySubstanceNamesAliasTable";

import { substanceAliasesTable } from "../helpers/substanceAliasesTable";
import { IMessageBuilder, MessageBuilder } from "../messages/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../messages/messageCategoryBuilder";
import { CommandCallback, ICommandContext } from "./command";

const TRIPSIT_API_ENDPOINT: string = "http://tripbot.tripsit.me/api/tripsit/getDrug";

export const executeComboCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    const substanceName: string = substanceAliasesTable.tryGetAlias(context.match[1]).replace(" ", "");
    const requestUrl: URL = new URL(TRIPSIT_API_ENDPOINT);
    requestUrl.searchParams.append("name", substanceName);

    rp(requestUrl.href)
        .then(async response => {
            if (response.err === true) {
                await context.replyMessageAsync(`Error fetching combos from TripSit: ${response.data.msg}`, "Markdown");
                return;
            }

            const responseData = JSON.parse(response).data[0];

            const rawCombos = responseData.combos;
            const combos: IIteratableTable = new IteratableTable();

            for (const substanceName in rawCombos) {
                if (rawCombos.hasOwnProperty(substanceName)) {
                    const prettySubstanceName: string = prettySubstanceNamesAliasTable.tryGetAlias(substanceName);
                    combos.add(rawCombos[substanceName].status, prettySubstanceName);
                }
            }

            await context.replyMessageAsync(buildSubstanceCombosMessage(responseData.pretty_name, combos), "HTML");
        })
        .catch(async error => {
            console.log(error);
            await context.replyMessageAsync(`Error getting **${substanceName}** combos from TripSit API`, "Markdown");
        })

}

export const executeHelpComboCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/combos <drug>`");
    messageBuilder.appendLine("Example: `/combos ketamine`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

function buildSubstanceCombosMessage(substanceName: string, combos: IIteratableTable): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendTitle(`${substanceName} combo information`);

    const order: string[] = ["Dangerous", "Unsafe", "Caution", "Low Risk & Decrease", "Low Risk & No Synergy", "Low Risk & Synergy"];
    for (const key of order) {
        const substances: string[] | null | undefined = combos.tryGetValues(key);
        if (!substances) { continue; }

        const icon: Icon = interactionIconTable.tryGetIcon(key);
        const categoryBuilder: IMessageCategoryBuilder = new MessageCategoryBuilder(`${icon} ${key}`, "");

        categoryBuilder.appendLines(substances.map(x => `- ${x}`));

        messageBuilder.appendCategory(categoryBuilder);
    }

    return messageBuilder.getContent();
}