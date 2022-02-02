export interface IAliasesTable {
    tryGetAlias(key: string): string;
}

export class AliasesTable implements IAliasesTable {
    constructor(private table: { [id: string]: string; }) { }

    tryGetAlias(key: string): string {
        return this.table[key] ?? key;
    }
}
