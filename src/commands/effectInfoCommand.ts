import rp from "request-promise"

import { ICommandContext, CommandCallback } from "./command";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IEffectInfo, IEffectInfoExternalLink } from "../types/effects";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { formatExternalLink } from "../helpers/formatters";

const EFFECT_INDEX_API_ENDPOINT: string = "https://www.effectindex.com/api/effects/";

export const executeEffectInfoCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    // build the request uri
    const uriFormattedEffectName: string = context.match[1].replace(" ", "-").toLowerCase();
    const requestUri: string = `${EFFECT_INDEX_API_ENDPOINT}${uriFormattedEffectName}`;

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
            await context.replyMessageAsync(buildEffectInfoMessage(uriFormattedEffectName, effectInfo), "HTML");
        })
        .catch(async error => {
            console.log(error);
            await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
        });
}

export const executeHelpEffectEffectInfoCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/effects <drug>`");
    messageBuilder.appendLine("Example: `/effects ketamine`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
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