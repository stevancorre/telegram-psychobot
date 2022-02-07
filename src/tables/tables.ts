import { Dictionary, IDictionary } from "../helpers/dictionary";

import durationAliasesJson from "./durationAliases.json";
import interactionIconsJson from "./interactionIcons.json";
import prettySubstanceNamesJson from "./prettySubstanceNames.json";
import substanceAliasesJson from "./substanceAliases.json";
import weightUnitsAliasesJson from "./weightUnitsAliases.json";

/**
 * Aliases for durations (ex: `hours` -> `h`)
 */
export const durationAliases: IDictionary<string, string> = new Dictionary<string, string>(durationAliasesJson);

/**
 * Icons for substance interactions levels
 */
export const interactionIcons: IDictionary<string, string> = new Dictionary<string, string>(interactionIconsJson);

/**
 * Pretty substance table (ex: `mdma` -> `MDMA`)
 */
export const prettySubstanceNames: IDictionary<string, string> = new Dictionary<string, string>(prettySubstanceNamesJson);

/**
 * Substance aliases (ex: `ket` -> `ketamine`)
 */
export const substanceAliases: IDictionary<string, string> = new Dictionary<string, string>(substanceAliasesJson);

export const weightUnitsAliases: IDictionary<string, string> = new Dictionary<string, string>(weightUnitsAliasesJson);