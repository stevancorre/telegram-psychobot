import { IMinMax } from "../types/minMax";
import { IDictionary } from "./dictionary";
import { IStringBuilder, StringBuilder } from "./stringBuilder";

/**
 * Formats a range or a single number with a units
 * 
 * @param value The target value
 * @param units The value's units
 * @param unitAliases The aliases for the unit (ex: `hours` can be translated to `h`)
 * 
 * @returns The formatted value
 */
export function formatMinMax(value: IMinMax | number | null | undefined, units: string | null | undefined, unitAliases?: IDictionary<string>): string {
    if (!value || !units) {
        return "";
    }

    if (unitAliases) {
        units = unitAliases.tryGetValue(units, units);
    }

    // example: 40mg
    if (typeof value === "number") {
        return `${value}${units}`
    }

    // example: 40mg - 50mg
    // here, we handle cases were either `min` or `max` is undefined
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

/**
 * Capitalizes the first letter of a string (ex: `hello world` -> `Hello world`)
 * 
 * @param value The target string
 * 
 * @returns The capitalized value
 */
export function capitalize(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
}

export function formatExternalLink(title: string, url: string): string {
    title = capitalize(title.replace(/\(.*\)/gm, "").trim());
    const websiteNameAndDomain: string = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)(.*)$/igm, "$1").trim().toLowerCase();

    return `${title}: <a href="${url}">${websiteNameAndDomain}</a>`
}