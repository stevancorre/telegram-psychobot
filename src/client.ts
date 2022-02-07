import TelegramBot from "node-telegram-bot-api";
import moment from 'moment';
import { CommandHandler, ICommandHandler } from "./commandHandler";

/**
 * Custom telegram client implementation
 */
export class TelegramClient extends TelegramBot {
    public constructor(token: string) {
        super(token, {
            polling: true
        });

        const commandHandler: ICommandHandler = new CommandHandler(this);
        commandHandler.registerCommands().then(async () => {
            const user: TelegramBot.User = await this.getMe();
            this.log(`Connected as @${user.username}`);
            this.log("Ready");
        })
    }

    public log(message: string): void {
        const time: string = moment(Date.now()).format("hh:mm:ss");
        console.log(`[${time}] ${message}`);
    }
}