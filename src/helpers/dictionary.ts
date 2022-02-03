export interface IDictionary<T> {
    add(key: string, value: T): void;

    getValue(key: string): T | undefined;
    tryGetValue(key: string, defaultValue: T): T;
}

export class Dictionary<T> implements IDictionary<T> {
    public constructor(
        protected readonly source: { [key: string]: T } = {}) { }

    add(key: string, value: T): void {
        if (this.source[key] !== undefined) {
            throw new Error(`Dictionary already contains a value for key \`${key}\`: \`${value}\``);
        }

        this.source[key] = value;
    }

    getValue(key: string): T | undefined {
        return this.source[key];
    }

    tryGetValue(key: string, defaultValue: T): T {
        if (this.source[key] === undefined) {
            return defaultValue;
        }

        return this.source[key];
    }
}