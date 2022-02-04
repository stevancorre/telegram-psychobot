import { Dictionary, IDictionary } from "../helpers/dictionary";

import durationAliasesJson from "./durationAliases.json";
import interactionIconsJson from "./interactionIcons.json";
import prettySubstanceNamesJson from "./prettySubstanceNames.json";
import substanceAliasesJson from "./substanceAliases.json";

export const durationAliases: IDictionary<string> = new Dictionary<string>(durationAliasesJson);
export const interactionIcons: IDictionary<string> = new Dictionary<string>(interactionIconsJson);
export const prettySubstanceNames: IDictionary<string> = new Dictionary<string>(prettySubstanceNamesJson);
export const substanceAliases: IDictionary<string> = new Dictionary<string>(substanceAliasesJson);