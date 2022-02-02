import { ITelegramClient, TelegramClient } from "./client";

require("dotenv").config();

const token: string | undefined = process.env.TOKEN;
if (token === undefined) {
    console.error("Missing configuration key `TOKEN` in `.env`.");
    process.exit(1);
}

const client: ITelegramClient = new TelegramClient(token);
