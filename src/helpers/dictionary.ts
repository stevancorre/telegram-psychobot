/**
 * Interface for a generic dictionary with basic methods
 */
export interface IDictionary<TKey, TValue> {
    /**
     * Adds a new key-value pair to the dictionary
     * 
     * @param key The unique key
     * @param value The value
     */
    add(key: TKey, value: TValue): void;

    /**
     * Finds the value corresponding to a specific key
     * 
     * @param key The unique key
     * @returns The value corresponding to the key if it was found. Otherwhise `undefined`
     */
    getValue(key: TKey): TValue | undefined;

    /**
     * 
     * @param key The unique key
     * @param defaultValue The default value
     * 
     * @returns The value corresponding to the key if it was found. Otherwhise the default value provided by the user
     */
    tryGetValue(key: TKey, defaultValue: TValue): TValue;
}

/**
 * Generic dictionary implementation
 */
export class Dictionary<TKey extends string | number | symbol, TValue> implements IDictionary<TKey, TValue> {
    public constructor(
        protected readonly source: { [key in TKey]?: TValue } = {}) { }

    add(key: TKey, value: TValue): void {
        // if we already have a key with a value, throw an error because each key has to be unique
        if (this.source[key] !== undefined) {
            throw `Dictionary already contains a value for key \`${key}\`: \`${value}\``;
        }

        this.source[key] = value;
    }

    getValue(key: TKey): TValue | undefined {
        return this.source[key];
    }

    tryGetValue(key: TKey, defaultValue: TValue): TValue {
        const value: TValue | undefined = this.source[key];
        if (value === undefined) {
            return defaultValue;
        }

        return value;
    }
}