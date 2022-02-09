import TelegramBot from "node-telegram-bot-api";
import { TelegramClient } from "../client";

/**
 * Interface for a context in which a command is executed
 */
export interface ICommandContext {
    /**
     * The current client
     */
    client: TelegramClient;

    /**
     * The current message
     */
    message: TelegramBot.Message;

    /**
     * The message match
     */
    match: RegExpExecArray | null;

    replyPhotoAsync(photo: string): Promise<TelegramBot.Message>;

    /**
     * Replies with a video or gif
     * 
     * @param video The video uri
     */
    replyVideoAsync(video: string): Promise<TelegramBot.Message>;

    /**
     * Replies with a message
     * 
     * @param text The message content
     * @param parseMode The message parse mode
     */
    replyMessageAsync(text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message>
}

/**
 * The command context implementation
 */
export class CommandContext implements ICommandContext {
    public constructor(
        public client: TelegramClient,
        public message: TelegramBot.Message,
        public match: RegExpExecArray | null) { }

    public async replyPhotoAsync(photo: string): Promise<TelegramBot.Message> {
        const chatId: number = this.message.chat.id;
        const messageId: number = this.message.message_id;

        return await this.client.sendPhoto(chatId, photo, { reply_to_message_id: messageId })
    }

    public async replyVideoAsync(video: string): Promise<TelegramBot.Message> {
        const chatId: number = this.message.chat.id;
        const messageId: number = this.message.message_id;

        return await this.client.sendVideo(chatId, video, { reply_to_message_id: messageId })
    }

    public async replyMessageAsync(text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {
        const chatId: number = this.message.chat.id;
        const messageId: number = this.message.message_id;

        options = { ...options, reply_to_message_id: messageId };
        return await this.client.sendMessage(chatId, text, options);
    }
}

export interface ICommand {
    name: string;
    description: string;
    args?: ICommandArg[];

    callback: CommandCallback;
}

export interface ICommandArg {
    name: string;
    description: string;

    type: CommandArgType;
}

export type CommandArgType = "effect" | "substance" | "weight";

/**
 * Callback type for a command
 */
export type CommandCallback = (context: ICommandContext, args?: any) => Promise<void>;

export type CommandValidateDataCallback = (context: ICommandContext) => boolean;