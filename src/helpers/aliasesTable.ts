export interface IAliasesTable {
    tryGetAlias(key: string): string;
}

export class AliasesTable implements IAliasesTable {
    private readonly table: { [id: string] : string; };

    constructor(items: { [id: string] : string; }) {
        this.table = items;
    }

    tryGetAlias(key: string): string {
        return this.table[key] ?? key;
    }
}
