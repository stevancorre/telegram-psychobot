import TelegramBot from "node-telegram-bot-api";
import { GraphQLClient } from 'graphql-request'

import { substanceAliasesTable } from "./helpers/substanceAliasesTable";
import { getPwInfoQuery, PwInfoResponse } from "./queries/infoQuery";
import { Substance } from "./types/Substance";
import { buildSubstanceRoas } from "./builders/substanceRoaBuilder";

type Message = TelegramBot.Message;
type MessageMatch = RegExpExecArray | null;

export class TelegramClient extends TelegramBot {
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
            if(!match) {
                return;
            }
            
            const substanceName: string = substanceAliasesTable.tryGetAlias(match[1]).replace(" ", "");
            const query: string = getPwInfoQuery(substanceName);

            const result = await this.graphqlClient.request<PwInfoResponse>(query);
            if(result.substances.length === 0) {
                return await this.sendReplyMessage(message, `ERREUR: Aucune données disponibles pour \`${match[1]}\``);
            }

            const substance: Substance = result.substances[0];
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

    private buildSubstanceInfoMessage(substance: Substance): string {
        let content: string = `<b><a href="${substance.url}">Informations sur la ${substance.name}</a></b>\n\n`;

        content += buildSubstanceRoas(substance);

        return content;
    }
}