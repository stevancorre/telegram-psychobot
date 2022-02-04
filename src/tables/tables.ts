import { Dictionary, IDictionary } from "../helpers/dictionary";

import durationAliasesJson from "./durationAliases.json";
import interactionIconsJson from "./interactionIcons.json";
import prettySubstanceNamesJson from "./prettySubstanceNames.json";
import substanceAliasesJson from "./substanceAliases.json";

/**
 * Aliases for durations (ex: `hours` -> `h`)
 */
export const durationAliases: IDictionary<string> = new Dictionary<string>(durationAliasesJson);

/**
 * Icons for substance interactions levels
 */
export const interactionIcons: IDictionary<string> = new Dictionary<string>(interactionIconsJson);

/**
 * Pretty substance table (ex: `mdma` -> `MDMA`)
 */
export const prettySubstanceNames: IDictionary<string> = new Dictionary<string>(prettySubstanceNamesJson);

/**
 * Substance aliases (ex: `ket` -> `ketamine`)
 */
export const substanceAliases: IDictionary<string> = new Dictionary<string>(substanceAliasesJson);