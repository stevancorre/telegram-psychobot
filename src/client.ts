import TelegramBot from "node-telegram-bot-api";

import { ICommandContext, CommandContext, CommandCallback } from "./commands/command";

import { executePingCommandAsync } from "./commands/pingCommand";
import { executeBreatheCommandAsync } from "./commands/breatheCommand";
import { executeHelpInfoCommandAsync, executeInfoCommandAsync } from "./commands/infoCommand";
import { executeHelpCommandAsync } from "./commands/helpCommand";
import { executeCombosCommandAsync, executeHelpCombosCommandAsync } from "./commands/combosCommand";
import { executeEffectsCommandAsync, executeHelpEffectsCommandAsync } from "./commands/effectsCommand";
import { executeEffectInfoCommandAsync, executeHelpEffectEffectInfoCommandAsync } from "./commands/effectInfoCommand";
import { executeHelpKetamineCalcCommandAsync, executeKetamineCalcCommandAsync } from "./commands/ketamineCalcCommand";

/**
 * Custom telegram client implementation with a command handler
 */
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
        this.registerCommand(/^\/effects$/i, executeHelpEffectsCommandAsync);
        this.registerCommand(/^\/effects (.*)$/i, executeEffectsCommandAsync);
        this.registerCommand(/^\/effectInfo$/i, executeHelpEffectEffectInfoCommandAsync);
        this.registerCommand(/^\/effectInfo (.*)$/i, executeEffectInfoCommandAsync);
        this.registerCommand(/^\/ketaminecalc$/i, executeHelpKetamineCalcCommandAsync);
        this.registerCommand(/^\/ketaminecalc ([0-9]+)$/i, executeHelpKetamineCalcCommandAsync);
        this.registerCommand(/^\/ketaminecalc ([0-9]+) (\w+)/i, executeKetamineCalcCommandAsync);

        // log the user tag in the standard output
        this.getMe().then((user: TelegramBot.User) => {
            console.log(`[CONNECTED AS @${user.username}]`);
        });
    }

    /**
     * Binds a command callback to an `onText` event
     * 
     * @param regexp The regular expression used to parse the user input
     * @param callback The command callback
     */
    private registerCommand(regexp: RegExp, callback: CommandCallback) {
        // bind the command callback to the right `onText` event
        this.onText(regexp, async (message: TelegramBot.Message, match: RegExpExecArray | null) => {
            const context: ICommandContext = new CommandContext(this, message, match);
            await callback(context);
        });
    }
}