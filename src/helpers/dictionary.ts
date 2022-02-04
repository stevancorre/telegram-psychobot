/**
 * Interface for a generic dictionary with basic methods
 */
export interface IDictionary<T> {
    /**
     * Adds a new key-value pair to the dictionary
     * 
     * @param key The unique key
     * @param value The value
     */
    add(key: string, value: T): void;

    /**
     * Finds the value corresponding to a specific key
     * 
     * @param key The unique key
     * @returns The value corresponding to the key if it was found. Otherwhise `undefined`
     */
    getValue(key: string): T | undefined;

    /**
     * 
     * @param key The unique key
     * @param defaultValue The default value
     * 
     * @returns The value corresponding to the key if it was found. Otherwhise the default value provided by the user
     */
    tryGetValue(key: string, defaultValue: T): T;
}

/**
 * Generic dictionary implementation
 */
export class Dictionary<T> implements IDictionary<T> {
    public constructor(
        protected readonly source: { [key: string]: T } = {}) { }

    add(key: string, value: T): void {
        // if we already have a key with a value, throw an error because each key has to be unique
        if (this.source[key] !== undefined) {
            throw `Dictionary already contains a value for key \`${key}\`: \`${value}\``;
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