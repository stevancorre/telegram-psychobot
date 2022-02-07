import TelegramBot from "node-telegram-bot-api";
import { TelegramClient } from "./client";

import { ICommand, ICommandContext, CommandContext } from "./helpers/command";
import { IMessageBuilder, MessageBuilder } from "./helpers/messageBuilder";
import { IStringBuilder, StringBuilder } from "./helpers/stringBuilder";

import { commands } from "./commands/commands";
import { parsers } from "./parsers/parsers";

export interface ICommandHandler {
    registerCommands(): Promise<void>;
}

export class CommandHandler implements ICommandHandler {
    public constructor(private readonly client: TelegramClient) { }

    public async registerCommands(): Promise<void> {
        const botCommands: TelegramBot.BotCommand[] = [];
        const helps: string[] = [];

        let failCount: number = 0;
        for (const command of commands) {
            if (!this.registerCommand(helps, command)) {
                failCount++;
                continue;
            }

            botCommands.push({
                command: command.name,
                description: command.description
            });

            this.client.log(`Registered command \`${command.name}\``);
        }

        await this.client.setMyCommands(botCommands);
        this.client.log(`${commands.length - failCount}/${commands.length} commands registered`);
    }

    private registerCommand(helps: string[], command: ICommand): boolean {
        const usage: string | undefined = this.getUsage(command);
        const argsRegexp: RegExp | undefined = this.getRegexp(command);
        if (!usage || !argsRegexp) { return false; }

        helps.push(usage);
        this.client.onText(new RegExp(`^/${command.name}`, "i"), async (message: TelegramBot.Message, match: RegExpExecArray | null) => {
            const context: ICommandContext = new CommandContext(this.client, message, match);
            if (!match) { return; }

            const argsMatch: RegExpExecArray | null = argsRegexp.exec(match.input.substring(command.name.length + 2));
            if (!argsMatch) {
                return await context.replyMessageAsync(usage, "Markdown");
            }

            const argv: any = {}
            let argPos: number = 1;
            for (const arg of command.args ?? []) {
                const parser = parsers.getValue(arg.type);
                const value: any | undefined = parser?.callback(argsMatch, argPos);

                if (value === undefined) {
                    return await context.replyMessageAsync(usage, "Markdown");
                }

                argv[arg.name] = value;
            }

            await command.callback(context, argv);
        });

        return true;
    }

    private getUsage(command: ICommand): string | undefined {
        const messageBuilder: IMessageBuilder = new MessageBuilder();

        const usageBuilder: IStringBuilder = new StringBuilder(`Usage: \`/${command.name} `);
        const exampleBuilder: IStringBuilder = new StringBuilder(`Example: \`/${command.name} `);

        for (const arg of command.args ?? []) {
            const argExample: string | undefined = parsers.getValue(arg.type)?.example;
            if (!argExample) {
                this.client.log(`error: missing example for type \`${arg.type}\``);
                return;
            }

            usageBuilder.append(`<${arg.name}> `);
            exampleBuilder.append(`${argExample} `);
        }

        usageBuilder.trimEnd().append("`");
        exampleBuilder.trimEnd().append("`");

        messageBuilder.appendLine(usageBuilder.getContent());
        messageBuilder.appendLine(exampleBuilder.getContent());

        return messageBuilder.getContent();
    }

    private getRegexp(command: ICommand): RegExp | undefined {
        const regexpBuilder: IStringBuilder = new StringBuilder();

        for (const arg of command.args ?? []) {
            const argRegexp = parsers.getValue(arg.type)?.regexp;
            if (!argRegexp) {
                this.client.log(`error: missing regexp for type \`${arg.type}\``);
                return;
            }

            regexpBuilder.append(`${argRegexp} `);
        }

        return new RegExp(regexpBuilder.trimEnd().getContent(), "i");
    }
}