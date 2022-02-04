import rp from "request-promise";

import { IDictionary, Dictionary } from "../helpers/dictionary";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { ICommandContext, CommandCallback } from "./command";

import { interactionIcons, prettySubstanceNames, substanceAliases } from "../tables/tables";

const TRIPSIT_API_ENDPOINT: string = "http://tripbot.tripsit.me/api/tripsit/getDrug";

/**
 * Execute the `/combos <substance>` command: shows all interactions available via the TripSit Api for a specific substance
 * 
 * @param context The context in which the command is executed
 */
export const executeCombosCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    // search for an alias and build the request uri
    const substanceName: string = substanceAliases.tryGetValue(context.match[1], context.match[1]).replace(" ", "");
    const requestUri: string = `${TRIPSIT_API_ENDPOINT}?name=${substanceName}`;

    // execute the request
    rp(requestUri)
        .then(async response => {
            if (response.err === true) {
                await context.replyMessageAsync(`Error fetching combos from TripSit: <b>${response.data.msg}</b>`, "HTML");
                return;
            }

            const responseData = JSON.parse(response).data[0];

            // check if the api gave us something
            const rawCombos = responseData.combos;
            if (!rawCombos) {
                await context.replyMessageAsync(`Error getting <b>${substanceName}</b> combos from TripSit API`, "HTML");
                return;
            }

            // parse raw data into a dictionary
            /* from 
               {
                   "<susbtance>": { "status": "<status>" }
               }

               to
               "<status>": [ "<substance>" ]
             */
            const combos: IDictionary<string[]> = new Dictionary<string[]>();

            for (const substanceName in rawCombos) {
                if (rawCombos.hasOwnProperty(substanceName)) {
                    // try to get a better name, by defaults all names are returned lowercase
                    const prettySubstanceName: string = prettySubstanceNames.tryGetValue(substanceName, substanceName);
                    const status: string = rawCombos[substanceName].status;
                    const substances: string[] | undefined = combos.getValue(status);

                    // if we don't have any substance corresponding to the current status, create a new list
                    if (!substances) {
                        combos.add(status, [prettySubstanceName]);
                    }
                    // otherwhise, just add the substance to the corresponding status
                    else {
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

/**
 * Displays the help for the `/combos <substance>` command. It get invoked if the user forget the `<substance>` argument
 * 
 * @param context The context in which the command is executed
 */
export const executeHelpCombosCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/combos <substance>`");
    messageBuilder.appendLine("Example: `/combos ketamine`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

/**
 * Builds the message content used to display combos data for any substance
 * 
 * @param substanceName The target substance name
 * @param combos Combos we have to display
 * @returns The raw message content (HTML)
 */
function buildSubstanceCombosMessage(substanceName: string, combos: IDictionary<string[]>): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`${substanceName} combo information`);

    // display data in a certain order so it's more readable and understandable
    const order: string[] = ["Dangerous", "Unsafe", "Caution", "Low Risk & Decrease", "Low Risk & No Synergy", "Low Risk & Synergy"];
    for (const key of order) {
        // if no substance is registered under the current status, just move to the next one
        const substances: string[] | null | undefined = combos.getValue(key);
        if (!substances) { continue; }

        const icon: string = interactionIcons.tryGetValue(key, "❔");
        const categoryBuilder: IMessageCategoryBuilder = new MessageCategoryBuilder(icon, key);

        categoryBuilder.appendLines(...substances.map(x => `- ${x}`));

        messageBuilder.appendCategory(categoryBuilder);
    }

    return messageBuilder.getContent();
}