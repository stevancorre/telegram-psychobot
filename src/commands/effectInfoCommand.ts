import rp from "request-promise"

import { ICommand, ICommandContext } from "../helpers/command";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { IEffectInfo } from "../types/effects";
import { formatExternalLink } from "../helpers/formatters";

const EFFECT_INDEX_API_ENDPOINT: string = "https://www.effectindex.com/api/effects/";


interface IEffectInfosCommandArgs {
    effect: string;
}

export const effectInfoCommand: ICommand = {
    name: "effectinfo",
    description: "Shows all effects available via the PsychonautWiki API for a specific substance",
    args: [
        {
            name: "effect",
            type: "effect",
            description: "The effect"
        }
    ],

    callback: async (context: ICommandContext, argv: IEffectInfosCommandArgs): Promise<void> => {
        const requestUri: string = `${EFFECT_INDEX_API_ENDPOINT}${argv.effect}`;

        // execute the request
        rp(requestUri)
            .then(async rawResponse => {
                const response: any = JSON.parse(rawResponse);

                // if the response is empty, something went wrong            
                if (!response.effect || !response.effect.summary_raw) {
                    await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
                    return;
                }

                const effectInfo: IEffectInfo = response.effect as IEffectInfo;
                await context.replyMessageAsync(buildEffectInfoMessage(argv.effect, effectInfo), "HTML");
            })
            .catch(async error => {
                console.log(error);
                await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
            });
    }
}

function buildEffectInfoMessage(uriFormattedEffectName: string, effectInfo: IEffectInfo): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(1);
    messageBuilder.appendTitle(`${effectInfo.name} effect information`, `https://www.effectindex.com/effects/${uriFormattedEffectName}`);

    const summary: IMessageCategoryBuilder = new MessageCategoryBuilder("🗒", "Summary");
    summary.appendLine(effectInfo.summary_raw);

    const links: IMessageCategoryBuilder = new MessageCategoryBuilder("🔗", "Links");
    links.appendLines(...effectInfo.external_links.map(x => `- ${formatExternalLink(x.title, x.url)}`));

    messageBuilder.appendCategory(summary);
    messageBuilder.appendCategory(links);

    return messageBuilder.getContent();
}