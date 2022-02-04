import { IStringBuilder, StringBuilder } from "../helpers/stringBuilder";

/**
 * Interface for a message category builder
 */
export interface IMessageCategoryBuilder extends IStringBuilder {
    /**
     * Appends a new key-value field
     * 
     * @param key The key (non unique)
     * @param value The value
     * 
     * @returns Itself
     */
    appendField(key: string, value: string | null | undefined): IMessageCategoryBuilder;
}

// TODO: remove useless features and refactor a little bit
/**
 * Message builder implementation
 */
export class MessageCategoryBuilder extends StringBuilder implements IMessageCategoryBuilder {
    private readonly titleLength: number;

    public constructor(title: string, private qualifiedName: string) {
        super();

        this.appendLineInTags(title, "b", "u");
        this.titleLength = super.getContent().length;
    }

    public appendField(key: string, value: string | null | undefined): IMessageCategoryBuilder {
        if (!value || value.length === 0) { return this; }

        this.appendInTags(key, "b");
        this.appendLine(`: ${value}`);

        return this;
    }

    public override getContent(): string {
        // if the content's length is the same as the title length, then no more content was added,
        // so we display a special message
        if (super.getContent().length === this.titleLength) {
            this.appendLineInTags(`No ${this.qualifiedName} information`, "i");
            this.appendNewLines(1);
        }

        return super.getContent();
    }
}