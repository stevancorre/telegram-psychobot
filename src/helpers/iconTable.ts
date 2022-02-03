import { Dictionary } from "./dictionary";

export type Icon = string;

export interface IIconTable {
    tryGetIcon(key: string): Icon;
}

export class IconTable extends Dictionary<Icon> implements IIconTable {
    tryGetIcon(key: string): Icon {
        return this.tryGetValue(key, "❔");
    }
}
