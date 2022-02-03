import rp from "request-promise";

import { CommandCallback, ICommandContext } from "./command";
import { IPwInfoResponse, getPwInfoQuery } from "../queries/infoQuery";
import { ISubstance } from "../types/ISubstance";
import { substanceAliasesTable } from "../helpers/substanceAliasesTable";
import { durationAliasesTable } from "../helpers/durationAliasesTable";
import { capitalize, formatMinMax } from "../helpers/formatters";
import { IMessageBuilder, MessageBuilder } from "../messages/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "../messages/messageCategoryBuilder";

const PW_ENDPOINT: string = "https://api.psychonautwiki.org/";

export const executeInfoCommandAsync: CommandCallback = async (context: ICommandContext): Promise<void> => {
    if (!context.match) {
        return;
    }

    const substanceName: string = substanceAliasesTable.tryGetAlias(context.match[1]).replace(" ", "");
    const query: string = getPwInfoQuery(substanceName);

    const encodedQuery = encodeURIComponent(query);
    const url = `${PW_ENDPOINT}/?query=${encodedQuery}`;

    try {
        const response: IPwInfoResponse = JSON.parse(await rp(url)) as IPwInfoResponse;
        if (!response.data.substances) {
            await context.replyMessageAsync(`Error: No API data available for **${context.match[1]}**`, "Markdown");
            return;
        }

        const substance: ISubstance = response.data.substances[0];
        await context.replyMessageAsync(buildSubstanceInfoMessage(substance), "HTML");

    } catch (err) {
        console.error("[ERROR]");
        console.error(err);

        await context.replyMessageAsync(`Error: No API data available for **${context.match[1]}**`, "Markdown");
    }
}

function buildSubstanceInfoMessage(substance: ISubstance): string {
    const messageBuilder: IMessageBuilder = new MessageBuilder();
    messageBuilder.appendTitle(`<a href="${substance.url}">${substance.name} drug information</a>`);

    const dosages: IMessageCategoryBuilder = new MessageCategoryBuilder("⚖️ Dosages", "dosage");
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

    const durations: IMessageCategoryBuilder = new MessageCategoryBuilder("🕐 Duration", "duration");
    for (const roa of substance.roas) {
        if (!roa || !roa.duration) { continue; }

        durations.appendLineInTags(`(${capitalize(roa.name)})`, "i");

        durations.appendField("Onset", formatMinMax(roa.duration.onset, roa.duration.onset?.units, durationAliasesTable));
        durations.appendField("Comeup", formatMinMax(roa.duration.comeup, roa.duration.comeup?.units, durationAliasesTable));
        durations.appendField("Peak", formatMinMax(roa.duration.peak, roa.duration.peak?.units, durationAliasesTable));
        durations.appendField("Offset", formatMinMax(roa.duration.offset, roa.duration.offset?.units, durationAliasesTable));
        durations.appendField("Afterglow", formatMinMax(roa.duration.afterglow, roa.duration.afterglow?.units, durationAliasesTable));
        durations.appendField("Total", formatMinMax(roa.duration.total, roa.duration.total?.units, durationAliasesTable));

        durations.appendNewLines(1);
    }

    const tolerance: IMessageCategoryBuilder = new MessageCategoryBuilder("📈 Tolerance", "tolerance");
    tolerance.appendField("Zero", substance.tolerance?.zero);
    tolerance.appendField("Half", substance.tolerance?.half);
    tolerance.appendField("Full", substance.tolerance?.full);
    tolerance.appendNewLines(1);

    const addictionPotential: IMessageCategoryBuilder = new MessageCategoryBuilder("⚠️ Addiction potential", "addiction potential");
    if (substance.addictionPotential) {
        addictionPotential.appendLine(capitalize(substance.addictionPotential));
    }

    messageBuilder.appendCategory(dosages);
    messageBuilder.appendCategory(durations);
    messageBuilder.appendCategory(tolerance);
    messageBuilder.appendCategory(addictionPotential);

    return messageBuilder.getContent();
}