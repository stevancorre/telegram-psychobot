import TelegramBot from "node-telegram-bot-api";

type Message = TelegramBot.Message;
type MessageMatch = RegExpExecArray | null;

export class TelegramClient extends TelegramBot {    
    public constructor(token: string) {
        super(token, {
            polling: true
        });

        this.registerCommands();
    }

    private registerCommands(): void {
        this.onText(/\/ping/i, async (message: Message, _: MessageMatch) => {
            await this.sendReplyMessage(message, "Pong! 🏓"); // table tennis emoji
        });

        this.onText(/\/breath|respire/i, async (message: Message, _: MessageMatch) => {
            await this.sendReplyVideo(message, "https://i.imgur.com/xtwSfR0.gif");
        });

        this.getMe().then((user: TelegramBot.User) => {
            console.log(`[CONNECTED AS @${user.username}]`);
        });
    }

    private sendReplyVideo(replyTo: Message, video: string): Promise<Message> {
        const chatId = replyTo.chat.id;
        return this.sendVideo(chatId, video, { reply_to_message_id: replyTo.message_id })
    }

    private sendReplyMessage(replyTo: Message, text: string): Promise<Message> {
        const chatId = replyTo.chat.id;
        return this.sendMessage(chatId, text, { reply_to_message_id: replyTo.message_id, parse_mode: "MarkdownV2" });
    }
}