import { TelegramClient } from "./client";

require("dotenv").config();

const token: string | undefined = process.env.TOKEN;
if (token === undefined) {
    console.error("Missing configuration key `TOKEN` in `.env`.");
    process.exit(1);
}

new TelegramClient(token);
