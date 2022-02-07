import { IParser } from "../helpers/parser";
import { weightUnitsAliases } from "../tables/tables";

export interface IWeight {
    pounds: number;
    inputUnits: string;
    full: string;
}

export const weightParser: IParser = {
    example: "70 kg",
    regexp: "([0-9]+) (kg|kilo|kilos|lbs|pound|pounds)",

    callback: (match: RegExpExecArray, argPosition: number) => {
        if (!match[argPosition] || !match[argPosition + 1]) {
            return;
        }

        const userWeight: number = Number.parseFloat(match[argPosition]);
        if (Number.isNaN(userWeight)) {
            return;
        }

        const units: string | undefined = weightUnitsAliases.getValue(match[argPosition + 1].toLowerCase());
        if (!units) {
            return;
        }

        let pounds: number = userWeight;
        if (units === "kg") {
            pounds = userWeight * 2.2;
        }

        return {
            pounds: pounds,
            inputUnits: units,
            full: `${userWeight.toFixed(0)}${units}`
        } as IWeight;
    }
}