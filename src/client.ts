import TelegramBot from "node-telegram-bot-api";
import { CommandCallback, ICommandContext, CommandContext } from "./commands/command";

import { executePingCommandAsync } from "./commands/pingCommand";
import { executeBreatheCommandAsync } from "./commands/breatheCommand";
import { executeInfoCommandAsync } from "./commands/infoCommand";

export interface ITelegramClient { }

export class TelegramClient extends TelegramBot implements ITelegramClient {
    public constructor(token: string) {
        super(token, {
            polling: true
        });

        // commands
        this.registerCommand(/^\/ping/i, executePingCommandAsync);
        this.registerCommand(/^\/breathe/i, executeBreatheCommandAsync);
        this.registerCommand(/^\/info (.*)/i, executeInfoCommandAsync);

        this.getMe().then((user: TelegramBot.User) => {
            console.log(`[CONNECTED AS @${user.username}]`);
        });
    }

    private registerCommand(regexp: RegExp, command: CommandCallback) {
        this.onText(regexp, async (message: TelegramBot.Message, match: RegExpExecArray | null) => {
            const context: ICommandContext = new CommandContext(this, message, match);
            await command(context);
        });
    }
}