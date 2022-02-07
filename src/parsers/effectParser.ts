import { IParser } from "../helpers/parser";

export const effectParser: IParser = {
    example: "after images",
    regexp: "(.*)",

    callback: (match: RegExpExecArray, argPosition: number) => {
        if (!match || !match[argPosition]) { return; }
    
        const effect: string = match[1].replace(" ", "-").toLowerCase();
        return effect;
    }
}