import { IStringBuilder, StringBuilder } from "../helpers/stringBuilder";

export interface IMessageCategoryBuilder extends IStringBuilder {
    appendField(key: string, value: string | null | undefined): IMessageCategoryBuilder;
}

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
        if (super.getContent().length === this.titleLength) {
            this.appendLineInTags(`No ${this.qualifiedName} information`, "i");
            this.appendNewLines(1);
        }

        return super.getContent();
    }
}