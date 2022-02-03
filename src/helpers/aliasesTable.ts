import { Dictionary } from "./dictionary";

export interface IAliasesTable {
    tryGetAlias(key: string): string;
}

export class AliasesTable extends Dictionary<string> implements IAliasesTable {
    tryGetAlias(key: string): string {
        return this.tryGetValue(key, key);
    }
}
