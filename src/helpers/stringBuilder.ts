export interface IStringBuilder {
    append(content: string): IStringBuilder;
    appendLine(content: string): IStringBuilder;
    appendLines(lines: string[]): IStringBuilder;
    appendNewLines(count: number): IStringBuilder;
    appendInTags(content: string, ...tags: string[]): IStringBuilder;
    appendLineInTags(content: string, ...tags: string[]): IStringBuilder;

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

    public appendLines(lines: string[]): IStringBuilder {
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