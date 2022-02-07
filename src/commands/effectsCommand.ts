import rp from "request-promise"

import { ICommand, ICommandContext } from "../helpers/command";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IEffect } from "../types/effects";
import { getPwEffectsQuery } from "../queries/effectsQuery";
import { capitalize } from "../helpers/formatters";
import { randomInt } from "crypto";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";

const PW_API_ENDPOINT: string = "https://api.psychonautwiki.org/";

// TODO: pagination?
const MAX_EFFECT_COUNT: number = 10;

interface IEffectsCommandArgs {
    substance: string;
}

export const effectsCommand: ICommand = {
    name: "effects",
    description: "Shows all effects available via the PsychonautWiki API for a specific substance",
    args: [
        {
            name: "substance",
            type: "substance",
            description: "The substance"
        }
    ],

    callback: async (context: ICommandContext, argv: IEffectsCommandArgs): Promise<void> => {
        const query: string = getPwEffectsQuery(argv.substance);
        const encodedQuery = encodeURIComponent(query);
        const requestUri: string = `${PW_API_ENDPOINT}?query=${encodedQuery}`;

        // execute the request
        rp(requestUri)
            .then(async rawResponse => {
                const response: any = JSON.parse(rawResponse);

                // if the response is empty, something went wrong            
                if (!response.data || !response.data.substances || !response.data.substances[0].effects) {
                    await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
                    return;
                }

                const substanceName: string = response.data.substances[0].name;
                const substanceEffects: IEffect[] = response.data.substances[0].effects;

                if (substanceEffects.length > MAX_EFFECT_COUNT) {
                    const countOfEffectsToRemove: number = substanceEffects.length - MAX_EFFECT_COUNT;
                    for (let i = 0; i < countOfEffectsToRemove; i++) {
                        substanceEffects.splice(randomInt(substanceEffects.length), 1);
                    }
                }

                await context.replyMessageAsync(buildSubstanceEffectsMessage(substanceName, substanceEffects), "HTML");
            })
            .catch(async error => {
                console.log(error);
                await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
            });
    }
}

function buildSubstanceEffectsMessage(substanceName: string, substanceEffects: IEffect[]): string {
    const susbtanceEffectsIndexUri: string = `https://psychonautwiki.org/wiki/${substanceName}#Subjective_effects`;

    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`${substanceName} effect informations`, susbtanceEffectsIndexUri);

    const effectsList: IMessageCategoryBuilder = new MessageCategoryBuilder("🗒", "Effects (randomly selected)");
    effectsList.appendLines(...substanceEffects.map(x => {
        if (x.url) {
            return `- <a href="${x.url}">${capitalize(x.name)}</a>`
        }

        return `- ${capitalize(x.name)}`
    }));

    const moreInformations: IMessageCategoryBuilder = new MessageCategoryBuilder("➕", "More informations");
    moreInformations.appendLine(`These effects were randomly selected from a larger list - <a href="${susbtanceEffectsIndexUri}">see all effects</a>`)

    messageBuilder.appendCategory(effectsList);
    messageBuilder.appendCategory(moreInformations);

    return messageBuilder.getContent();
}