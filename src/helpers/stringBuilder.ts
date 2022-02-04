/**
 * Interface for a string builder
 */
export interface IStringBuilder {
    /**
     * Appends a string to the content
     * 
     * @param content The content to append
     *
     * @returns Itself 
     */
    append(content: string): IStringBuilder;

    /**
     * Appends a new-line-terminated string to the content 
     * 
     * @param content The content to append
     *
     * @returns Itself 
     */
    appendLine(content: string): IStringBuilder;

    /**
     * Appends new-line-terminated strings to the content
     * 
     * @param lines The lines to append
     *
     * @returns Itself 
     */
    appendLines(...lines: string[]): IStringBuilder;

    /**
     * Appends `count` new lines to the content
     * 
     * @param count The count of new lines to append
     *
     * @returns Itself 
     */
    appendNewLines(count: number): IStringBuilder;

    /**
     * Appends a string surrounded by `tags` (ex: `<b>content</b>`)
     * 
     * @param content The inner content to append
     * @param tags The tags
     *
     * @returns Itself 
     */
    appendInTags(content: string, ...tags: string[]): IStringBuilder;

    /**
     * Appends a new-line-terminated string surrounded by `tags` (ex: `<b>content</b>\n`)
     * 
     * @param content The inner content to append
     * @param tags The tags
     *
     * @returns Itself 
     */
    appendLineInTags(content: string, ...tags: string[]): IStringBuilder;

    /**
     * Gets the builder's the content
     * 
     * @returns The builder's content 
     */

    getContent(): string;
}

export class StringBuilder implements IStringBuilder {
    public constructor(private content: string = "") { }

    public append(content: string): IStringBuilder {
        this.content += content;
        return this;
    }

    public appendLine(content: string): IStringBuilder {
        return this.append(content).append("\n");
    }

    public appendLines(...lines: string[]): IStringBuilder {
        return this.appendLine(lines.join("\n"));
    }

    public appendNewLines(count: number): IStringBuilder {
        return this.append("\n".repeat(count));
    }

    public appendInTags(content: string, ...tags: string[]): IStringBuilder {
        // opening tags
        for (const tag of tags) {
            this.append(`<${tag}>`);
        }

        // content
        this.append(content);

        // closing tags
        const reversedTags: string[] = tags.reverse();
        for (const tag of reversedTags) {
            this.append(`</${tag}>`);
        }

        return this;
    }

    public appendLineInTags(content: string, ...tags: string[]): IStringBuilder {
        return this.appendInTags(content, ...tags).append("\n");
    }

    public getContent(): string {
        return this.content;
    }
}