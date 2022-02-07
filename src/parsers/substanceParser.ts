import { IParser } from "../helpers/parser";
import { substanceAliases } from "../tables/tables";

export const substanceParser: IParser = {
    example: "70 kg",
    regexp: "(.*)",

    callback: (match: RegExpExecArray, argPosition: number) => {
        if (!match || !match[argPosition]) { return; }

        const substance: string = match[argPosition].replace(" ", "");
        return substanceAliases.tryGetValue(substance, substance);
    }
}