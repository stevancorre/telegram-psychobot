import { IMinMax } from "../types/IMinMax";
import { IAliasesTable } from "./aliasesTable";
import { IStringBuilder, StringBuilder } from "./stringBuilder";

export function formatMinMax(value: IMinMax | number | null | undefined, units: string | null | undefined, unitAliases?: IAliasesTable): string {
    if (!value || !units) {
        return "";
    }

    if (unitAliases) {
        units = unitAliases.tryGetAlias(units);
    }

    if (typeof value === "number") {
        return `${value}${units}`
    }

    const builder: IStringBuilder = new StringBuilder();
    if (value.min) {
        builder.append(`${value.min}${units}`);
        if (value.max) {
            builder.append(` - ${value.max}${units}`);
        }
    }
    else if (value.max) {
        builder.append(`${value.max}${units}`);
    }

    return builder.getContent();
}

export function capitalize(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
}