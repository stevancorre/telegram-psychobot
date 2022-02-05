import { weightUnitsAliases } from "../tables/tables";

export interface IWeight {
   pounds: number;
   units: string;
   full: string; 
}

export function parseWeight(match: RegExpExecArray, argPosition: number = 1): IWeight | undefined {
    // [1] reserved for command
    if (!match[argPosition] || !match[argPosition + 1]) {
        return;
    }

    let weight: number = Number.parseFloat(match[argPosition]);
    if (Number.isNaN(weight)) {
        return;
    }

    const units: string | undefined = weightUnitsAliases.getValue(match[argPosition + 1].toLowerCase());
    if (!units) {
        return;
    }

    if(units === "kg") {
        weight *= 2.2;
    }

    return { 
        pounds: weight,
        units: units,
        full: `${weight}${units}`
    } as IWeight;
}