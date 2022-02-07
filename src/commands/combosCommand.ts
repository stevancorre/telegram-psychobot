import rp from "request-promise";

import { ICommand, ICommandContext } from "../helpers/command";
import { IDictionary, Dictionary } from "../helpers/dictionary";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";

import { interactionIcons, prettySubstanceNames } from "../tables/tables";

const TRIPSIT_API_ENDPOINT: string = "http://tripbot.tripsit.me/api/tripsit/getDrug";

interface ICombosCommandArguments {
    substance: string;
}

export const combosCommand: ICommand = {
    name: "combos",
    description: "Shows all combos available via the TripSit Api for a specific substance",
    args: [
        {
            name: "substance",
            type: "substance",
            description: "The substance"
        }
    ],

    callback: async (context: ICommandContext, argv: ICombosCommandArguments): Promise<void> => {
        const requestUri: string = `${TRIPSIT_API_ENDPOINT}?name=${argv.substance}`;

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
                    await context.replyMessageAsync(`Error getting <b>${argv.substance}</b> combos from TripSit API`, "HTML");
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
                const combos: IDictionary<string, string[]> = new Dictionary<string, string[]>();

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
                await context.replyMessageAsync(`Error getting <b>${context.match![1]}</b> combos from TripSit API`, "HTML");
            });
    }
}

/**
 * Builds the message content used to display combos data for any substance
 * 
 * @param substanceName The target substance name
 * @param combos Combos we have to display
 * @returns The raw message content (HTML)
 */
function buildSubstanceCombosMessage(substanceName: string, combos: IDictionary<string, string[]>): string {
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