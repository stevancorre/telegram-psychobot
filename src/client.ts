import TelegramBot from "node-telegram-bot-api";
import { GraphQLClient } from 'graphql-request'

import { substanceAliasesTable } from "./helpers/substanceAliasesTable";
import { durationAliasesTable } from "./helpers/durationAliasesTable";
import { getPwInfoQuery, PwInfoResponse } from "./queries/infoQuery";
import { ISubstance } from "./types/ISubstance";
import { IMessageBuilder, MessageBuilder } from "./messages/messageBuilder";
import { IMessageCategoryBuilder, MessageCategoryBuilder } from "./messages/messageCategoryBuilder";
import { capitalize, formatMinMax } from "./helpers/formatters";

type Message = TelegramBot.Message;
type MessageMatch = RegExpExecArray | null;

export interface ITelegramClient { }

export class TelegramClient extends TelegramBot implements ITelegramClient {
    private readonly PW_ENDPOINT: string = "https://api.psychonautwiki.org/";
    private readonly graphqlClient: GraphQLClient;

    public constructor(token: string) {
        // telegram client itself
        super(token, {
            polling: true
        });

        this.registerCommands();

        // graphql client
        this.graphqlClient = new GraphQLClient(this.PW_ENDPOINT);
    }

    private registerCommands(): void {
        this.onText(/\/ping/i, async (message: Message, _: MessageMatch) => {
            await this.sendReplyMessage(message, "Pong! 🏓"); // table tennis emoji
        });

        this.onText(/\/breath/i, async (message: Message, _: MessageMatch) => {
            await this.sendReplyVideo(message, "https://i.imgur.com/xtwSfR0.gif");
        });

        this.onText(/\/info (.*)/i, async (message: Message, match: MessageMatch) => {
            if (!match) {
                return;
            }

            const substanceName: string = substanceAliasesTable.tryGetAlias(match[1]).replace(" ", "");
            const query: string = getPwInfoQuery(substanceName);

            const result = await this.graphqlClient.request<PwInfoResponse>(query);
            if (result.substances.length === 0) {
                return await this.sendReplyMessage(message, `Error: No API data available for \`${match[1]}\``);
            }

            const substance: ISubstance = result.substances[0];
            await this.sendReplyMessage(message, this.buildSubstanceInfoMessage(substance), "HTML");
        });

        this.onText(/\/test/i, async (message: Message, _: MessageMatch) => {
            await this.sendReplyMessage(message, "Ok");
        });

        this.getMe().then((user: TelegramBot.User) => {
            console.log(`[CONNECTED AS @${user.username}]`);
        });
    }

    private sendReplyVideo(replyTo: Message, video: string): Promise<Message> {
        const chatId = replyTo.chat.id;
        return this.sendVideo(chatId, video, { reply_to_message_id: replyTo.message_id })
    }

    private sendReplyMessage(replyTo: Message, text: string, parse_mode: TelegramBot.ParseMode = "MarkdownV2"): Promise<Message> {
        const chatId = replyTo.chat.id;
        return this.sendMessage(chatId, text, { reply_to_message_id: replyTo.message_id, parse_mode: parse_mode });
    }

    private buildSubstanceInfoMessage(substance: ISubstance): string {
        const messageBuilder: IMessageBuilder = new MessageBuilder();
        messageBuilder.appendTitle(`<a href="${substance.url}">${substance.name} drug information</a>`);

        const dosages: IMessageCategoryBuilder = new MessageCategoryBuilder("⚖️ Dosages", "dosage");
        for (const roa of substance.roas) {
            if (!roa || !roa.dose || !roa.dose.units) { continue; }

            dosages.appendLineInTags(`(${capitalize(roa.name)})`, "i");

            dosages.appendField("Threshold", formatMinMax(roa.dose.threshold, roa.dose.units));
            dosages.appendField("Light", formatMinMax(roa.dose.light, roa.dose.units));
            dosages.appendField("Common", formatMinMax(roa.dose.common, roa.dose.units));
            dosages.appendField("Strong", formatMinMax(roa.dose.strong, roa.dose.units));
            dosages.appendField("Heavy", formatMinMax(roa.dose.heavy, roa.dose.units));
        }

        const durations: IMessageCategoryBuilder = new MessageCategoryBuilder("🕐 Duration", "duration");
        for (const roa of substance.roas) {
            if (!roa || !roa.duration) { continue; }

            durations.appendLineInTags(`(${capitalize(roa.name)})`, "i");

            durations.appendField("Onset", formatMinMax(roa.duration.onset, roa.duration.onset?.units, durationAliasesTable));
            durations.appendField("Comeup", formatMinMax(roa.duration.comeup, roa.duration.comeup?.units, durationAliasesTable));
            durations.appendField("Peak", formatMinMax(roa.duration.peak, roa.duration.peak?.units, durationAliasesTable));
            durations.appendField("Offset", formatMinMax(roa.duration.offset, roa.duration.offset?.units, durationAliasesTable));
            durations.appendField("Afterglow", formatMinMax(roa.duration.afterglow, roa.duration.afterglow?.units, durationAliasesTable));
            durations.appendField("Total", formatMinMax(roa.duration.total, roa.duration.total?.units, durationAliasesTable));
        }

        messageBuilder.appendCategory(dosages);
        messageBuilder.appendCategory(durations);

        return messageBuilder.getContent();
    }
}