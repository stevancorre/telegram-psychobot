import { IStringBuilder, StringBuilder } from "./stringBuilder";
import { IMessageCategoryBuilder } from "./messageCategoryBuilder";

/**
 * Interface for a message builder
 */
export interface IMessageBuilder extends IStringBuilder {
    /**
     * Appends a title to the message (bold text with a new line)
     * 
     * @param title The title's text (can be HTML)
     * 
     * @returns Itself
     */
    appendTitle(title: string): IMessageBuilder;

    /**
     * Set the count of spaces between two categories
     * 
     * @param count How many space we want to have
     * 
     * @returns Itself
     */
    setCategoriesSpacing(count: number): IMessageBuilder;

    /**
     * Appends a category to the message
     * 
     * @param category A category builder
     * 
     * @returns Itself
     */
    appendCategory(category: IMessageCategoryBuilder): IMessageBuilder;
}

/**
 * Message builder implementation
 */
export class MessageBuilder extends StringBuilder implements IMessageBuilder {
    private categoriesSpaceCount: number = 2;
    
    public setCategoriesSpacing(count: number) {
        this.categoriesSpaceCount = count;
        
        return this;
    }

    public appendTitle(title: string): IMessageBuilder {
        this.appendLineInTags(title, "b");
        this.appendNewLines(1);

        return this;
    }

    public appendCategory(category: IMessageCategoryBuilder): IMessageBuilder {
        let content: string = category.getContent();
        while(!content.endsWith("\n".repeat(this.categoriesSpaceCount))) {
            content += "\n";
        }
      
        this.appendLine(content);
        return this;
    }
}