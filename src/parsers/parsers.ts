import { IParser } from "../helpers/parser";
import { CommandArgType } from "../helpers/command";
import { Dictionary, IDictionary } from "../helpers/dictionary";

import { effectParser } from "./effectParser";
import { substanceParser } from "./substanceParser";
import { weightParser } from "./weightParser";

// TODO parser<any> -> parser<T> -> args as T

export const Parsers: IDictionary<CommandArgType, IParser> = new Dictionary<CommandArgType, IParser>({
    ["effect"]: effectParser,
    ["substance"]: substanceParser,
    ["weight"]: weightParser,
});
