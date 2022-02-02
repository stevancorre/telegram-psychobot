import { durationAliasesTable } from "../helpers/durationAliasesTable";
import { StringBuilder } from "../helpers/stringBuilder";
import { MinMax, MinMaxUnits } from "../types/MinMax";
import { Substance, SubstanceRoa, SubstanceRoaDosage, SubstanceRoaDuration } from "../types/Substance";

export function buildSubstanceRoas(substance: Substance): string {
    let content: StringBuilder = new StringBuilder();

    buildCategory(content, "⚖️ Dosages", "les dosages", substance.roas, buildSubstanceRoaDosage);
    buildCategory(content, "🕐 Durées", "les durées", substance.roas, buildSubstanceRoaDuration);

    return content.getContent();
}

function buildCategory<T>(content: StringBuilder, title: string, qualifiedName: string, collection: T[] | null, iterator: (content: StringBuilder, item: T) => void) {
    content.appendLineInTags(title, "b", "u");

    if (collection && collection.length > 0) {
        for (const item of collection) {
            iterator(content, item);
        }
    }
    else {
        content.appendLineInTags(`Pas d'informations sur ${qualifiedName}`, "i");
        content.appendNewLines(1);
    }
}

// Dosages
function buildSubstanceRoaDosage(content: StringBuilder, roa: SubstanceRoa) {
    const dosages: SubstanceRoaDosage | null = roa.dose;
    if (!dosages || !dosages.units) {
        content.appendLineInTags("Pas d'informations sur les dosages", "i");
        return;
    }

    content.appendLineInTags(`(${roa.name})`, "i");

    buildDosageTier(content, "Seuil", dosages.units, dosages.threshold);
    buildDosageTier(content, "Léger", dosages.units, dosages.light);
    buildDosageTier(content, "Commun", dosages.units, dosages.common);
    buildDosageTier(content, "Fort", dosages.units, dosages.strong);
    buildDosageTier(content, "Lourd", dosages.units, dosages.heavy as MinMax | number | null);

    content.appendNewLines(1);
}

function buildDosageTier(content: StringBuilder, dosageName: string, units: string, dosage: MinMax | number | null | undefined) {
    if (!dosage) { return; }

    content.appendInTags(dosageName, "b").append(": ");

    if (typeof dosage == "number") {
        content.appendLine(`${dosage}${units}`);
    } else {
        content.appendLine(`${dosage.min}${units} - ${dosage.max}${units}`);
    }
}

// Durations
function buildSubstanceRoaDuration(content: StringBuilder, roa: SubstanceRoa) {
    const durations: SubstanceRoaDuration | null = roa.duration;
    if (!durations) {
        content.appendLineInTags("Pas d'informations sur les durées", "i");
        return;
    }

    content.appendLineInTags(`(${roa.name})`, "i");

    buildDurationTier(content, "Début", durations.onset);
    buildDurationTier(content, "Montée", durations.comeup);
    buildDurationTier(content, "Pic", durations.peak);
    buildDurationTier(content, "Descente", durations.offset);
    buildDurationTier(content, "Effets secondaires", durations.afterglow);

    content.appendNewLines(1);
}

function buildDurationTier(content: StringBuilder, durationName: string, duration: MinMaxUnits | null) {
    if (!duration || !duration.units) { return; }

    const units: string = durationAliasesTable.tryGetAlias(duration.units);
    content.appendInTags(durationName, "b").append(": ");

    if (duration.min) {
        content.append(`${duration.min}${units}`);
        if (duration.max) {
            content.appendLine(` - ${duration.max}${units}`);
        }
        else {
            content.appendNewLines(1);
        }
    }
    else if (duration.max) {
        content.append(`${duration.max}${units}`);
    }
}

// Tolerance