// TODO: handle categories (e.g `Category:Mushroom`)

import rp from "request-promise";

import { ICommandContext, CommandCallback } from "./command";
import { ISubstance } from "../types/substance";
import { IMessageBuilder, MessageBuilder } from "../helpers/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../helpers/messageCategoryBuilder";
import { getPwInfoQuery } from "../queries/infoQuery";

import { capitalize, formatMinMax } from "../helpers/formatters";
import { durationAliases, substanceAliases } from "../tables/tables";

const PW_API_ENDPOINT: string = "https://api.psychonautwiki.org/";

/**
 * Execute the `/help` command: shows a little presentation message and a list of all commands
 * 
 * @param context The context in which the command is executed
 */
export const executeInfoCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    // search for an alias and build the request uri
    const substanceName: string = substanceAliases.tryGetValue(context.match[1], context.match[1]).replace(" ", "");
    const query: string = getPwInfoQuery(substanceName);
    const encodedQuery = encodeURIComponent(query);
    const requestUri: string = `${PW_API_ENDPOINT}?query=${encodedQuery}`;

    // execute the request
    rp(requestUri)
        .then(async rawResponse => {
            const response: any = JSON.parse(rawResponse);

            // if the response is empty, something went wrong
            if (!response.data || !response.data.substances) {                
                await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
                return;
            }

            const substance: ISubstance = response.data.substances[0];
            await context.replyMessageAsync(buildSubstanceInfoMessage(substance), "HTML");
        })
        .catch(async error => {
            console.log(error);
            await context.replyMessageAsync(`Error: No API data available for <b>${context.match![1]}</b>`, "HTML");
        });
}

/**
 * Displays the help for the `/info <substance>` command. It get invoked if the user forget the `<substance>` argument
 * 
 * @param context The context in which the command is executed
 */
export const executeHelpInfoCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendLine("Usage: `/info <drug>`");
    messageBuilder.appendLine("Example: `/info ketamine`");

    await context.replyMessageAsync(messageBuilder.getContent(), "Markdown");
}

/**
 * Builds the message content used to display combos data for any substance
 * 
 * @param substance The substance we have to display
 * @returns The raw message content (HTML)
 */
function buildSubstanceInfoMessage(substance: ISubstance): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.setCategoriesSpacing(2);
    messageBuilder.appendTitle(`<a href="${substance.url}">${substance.name} drug information</a>`);

    // Dosages
    const dosages: IMessageCategoryBuilder = new MessageCategoryBuilder("⚖️", "Dosage");
    for (const roa of substance.roas) {
        if (!roa || !roa.dose || !roa.dose.units) { continue; }

        dosages.appendLineInTags(`(${capitalize(roa.name)})`, "i");

        dosages.appendField("Threshold", formatMinMax(roa.dose.threshold, roa.dose.units));
        dosages.appendField("Light", formatMinMax(roa.dose.light, roa.dose.units));
        dosages.appendField("Common", formatMinMax(roa.dose.common, roa.dose.units));
        dosages.appendField("Strong", formatMinMax(roa.dose.strong, roa.dose.units));
        dosages.appendField("Heavy", formatMinMax(roa.dose.heavy, roa.dose.units));

        dosages.appendNewLines(1);
    }

    // Durations
    const durations: IMessageCategoryBuilder = new MessageCategoryBuilder("🕐", "Duration");
    for (const roa of substance.roas) {
        if (!roa || !roa.duration) { continue; }

        durations.appendLineInTags(`(${capitalize(roa.name)})`, "i");

        durations.appendField("Onset", formatMinMax(roa.duration.onset, roa.duration.onset?.units, durationAliases));
        durations.appendField("Comeup", formatMinMax(roa.duration.comeup, roa.duration.comeup?.units, durationAliases));
        durations.appendField("Peak", formatMinMax(roa.duration.peak, roa.duration.peak?.units, durationAliases));
        durations.appendField("Offset", formatMinMax(roa.duration.offset, roa.duration.offset?.units, durationAliases));
        durations.appendField("Afterglow", formatMinMax(roa.duration.afterglow, roa.duration.afterglow?.units, durationAliases));
        durations.appendField("Total", formatMinMax(roa.duration.total, roa.duration.total?.units, durationAliases));

        durations.appendNewLines(1);
    }

    // Tolerance
    const tolerance: IMessageCategoryBuilder = new MessageCategoryBuilder("📈", "Tolerance");
    tolerance.appendField("Full", substance.tolerance?.full);
    tolerance.appendField("Half", substance.tolerance?.half);
    tolerance.appendField("Baseline", substance.tolerance?.zero);

    // Addiction potential
    const addictionPotential: IMessageCategoryBuilder = new MessageCategoryBuilder("⚠️", "Addiction potential");
    if (substance.addictionPotential) {
        addictionPotential.appendLine(capitalize(substance.addictionPotential));
    }

    // Append all categories one by one
    messageBuilder.appendCategory(dosages);
    messageBuilder.appendCategory(durations);
    messageBuilder.appendCategory(tolerance);
    messageBuilder.appendCategory(addictionPotential);

    return messageBuilder.getContent();
}