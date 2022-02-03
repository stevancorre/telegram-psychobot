export interface IIteratableTable {
    add(key: string, value: string): void;
    forEach(callback: IteratableTableCallback): void;
    tryGetValues(key: string): string[] | undefined | null;
}

export type IteratableTableCallback = (key: string, values: string[]) => void;

export class IteratableTable implements IIteratableTable {
    private readonly keys: string[] = [];

    constructor(private readonly table: { [key: string]: string[]; } = {}) { }

    public forEach(callback: IteratableTableCallback): void {
        for (const key of this.keys) {
            callback(key, this.table[key]);
        }
    }

    public add(key: string, value: string): void {
        if (this.table[key] === undefined) {
            this.keys.push(key);
            this.table[key] = [];
        }

        this.table[key].push(value);
    }

    public tryGetValues(key: string): string[] | undefined | null {
        return this.table[key];
    }
}
