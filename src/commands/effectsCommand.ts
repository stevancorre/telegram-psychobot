import rp from "request-promise"

import { ICommandContext, CommandCallback } from "./command";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IEffect } from "../types/effects";
import { getPwEffectsQuery } from "../queries/effectsQuery";
import { substanceAliases } from "../tables/tables";
import { capitalize } from "../helpers/formatters";
import { randomInt } from "crypto";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";

const PW_API_ENDPOINT: string = "https://api.psychonautwiki.org/";

// TODO: pagination?
const MAX_EFFECT_COUNT: number = 10;

export const executeEffectsCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    // search for an alias and build the request uri
    const substanceName: string = substanceAliases.tryGetValue(context.match[1], context.match[1]).replace(" ", "");
    const query: string = getPwEffectsQuery(substanceName);
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

            if(substanceEffects.length > MAX_EFFECT_COUNT) {
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

export const executeHelpEffectsCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/effects <drug>`");
    messageBuilder.appendLine("Example: `/effects ketamine`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

function buildSubstanceEffectsMessage(substanceName: string, substanceEffects: IEffect[] ): string {
    const susbtanceEffectsIndexUri: string = `https://psychonautwiki.org/wiki/${substanceName}#Subjective_effects`;

    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`<a href="${susbtanceEffectsIndexUri}">${substanceName} effect informations</a>`);

    const effectsList: IMessageCategoryBuilder = new MessageCategoryBuilder("🗒", "Effects (randomly selected)");
    effectsList.appendLines(...substanceEffects.map(x => {
        if(x.url) {
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