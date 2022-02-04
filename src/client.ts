import TelegramBot from "node-telegram-bot-api";

import { ICommandContext, CommandContext, CommandCallback } from "./commands/command";

import { executePingCommandAsync } from "./commands/pingCommand";
import { executeBreatheCommandAsync } from "./commands/breatheCommand";
import { executeHelpInfoCommandAsync, executeInfoCommandAsync } from "./commands/infoCommand";
import { executeHelpCommandAsync } from "./commands/helpCommand";
import { executeCombosCommandAsync, executeHelpCombosCommandAsync } from "./commands/combosCommand";

export class TelegramClient extends TelegramBot {
    public constructor(token: string) {
        super(token, {
            polling: true
        });

        // commands
        this.registerCommand(/^\/help/i, executeHelpCommandAsync);
        this.registerCommand(/^\/ping/i, executePingCommandAsync);
        this.registerCommand(/^\/breathe/i, executeBreatheCommandAsync);
        this.registerCommand(/^\/info$/i, executeHelpInfoCommandAsync)
        this.registerCommand(/^\/info (.*)/i, executeInfoCommandAsync);
        this.registerCommand(/^\/combos$/i, executeHelpCombosCommandAsync);
        this.registerCommand(/^\/combos (.*)$/i, executeCombosCommandAsync);

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