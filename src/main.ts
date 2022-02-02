require("dotenv").config();

import config from './config.json'; 

console.log(`${config.name} v${config.version} by ${config.author}`);
console.log(`Repository: ${config.githubRepository}`);

const TOKEN: string | undefined = process.env.TOKEN;
if (TOKEN === undefined) {
    console.error("Missing configuration key `TOKEN` in `.env`.");
    process.exit(1);
}