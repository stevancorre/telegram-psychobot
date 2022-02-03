import TelegramBot from "node-telegram-bot-api";
import { TelegramClient } from "../client";

export interface ICommandContext {
    client: TelegramClient;
    message: TelegramBot.Message;
    match: RegExpExecArray | null;

    replyVideoAsync(video: string): Promise<TelegramBot.Message>;
    replyMessageAsync(text: string, parseMode: TelegramBot.ParseMode): Promise<TelegramBot.Message>
}

export class CommandContext implements ICommandContext {
    public constructor(
        public client: TelegramClient,
        public message: TelegramBot.Message,
        public match: RegExpExecArray | null) { }

    public async replyVideoAsync(video: string): Promise<TelegramBot.Message> {
        const chatId: number = this.message.chat.id;
        const messageId: number = this.message.message_id;

        return await this.client.sendVideo(chatId, video, { reply_to_message_id: messageId })
    }

    public async replyMessageAsync(text: string, parseMode: TelegramBot.ParseMode = "MarkdownV2"): Promise<TelegramBot.Message> {
        const chatId: number = this.message.chat.id;
        const messageId: number = this.message.message_id;

        return await this.client.sendMessage(chatId, text, { reply_to_message_id: messageId, parse_mode: parseMode });
    }
}

export type CommandCallback = (context: ICommandContext) => Promise<void>;