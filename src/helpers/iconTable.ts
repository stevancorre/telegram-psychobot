export type Icon = string;

export interface IIconTable {
    missingIcon: Icon;

    tryGetIcon(key: string): Icon;
}

export class IconTable implements IIconTable {
    constructor(
        private readonly table: { [id: string]: Icon; } = {},
        public missingIcon: string = "❔") { }

    tryGetIcon(key: string): Icon {
        return this.table[key] ?? this.missingIcon;
    }
}
