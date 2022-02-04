import { IStringBuilder, StringBuilder } from "./stringBuilder";
import { IMessageCategoryBuilder } from "./messageCategoryBuilder";

export interface IMessageBuilder extends IStringBuilder {
    appendTitle(title: string): IMessageBuilder;
    appendCategory(category: IMessageCategoryBuilder): IMessageBuilder;
}

export class MessageBuilder extends StringBuilder implements IMessageBuilder {
    public appendTitle(title: string): IMessageBuilder {
        this.appendLineInTags(title, "b");
        this.appendNewLines(1);

        return this;
    }

    public appendCategory(category: IMessageCategoryBuilder): IMessageBuilder {
        this.appendLine(category.getContent());

        return this;
    }
}