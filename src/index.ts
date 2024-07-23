import { Client, GatewayIntentBits } from "discord.js";
import { CommandKit } from "commandkit";
import 'dotenv/config';
import { Utilities, Logger } from "utilities";

Logger.setup(true); // Enable logger

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks,
    ],
});

new Utilities({
    databaseName: 'database',
    databaseLocation: `${__dirname}`,
})

new CommandKit({
    client,
    eventsPath: `${__dirname}/events`,
    commandsPath: `${__dirname}/commands`,
    devGuildIds: ['721236290938601542'],
    devUserIds: ['429810730691461130'],
    bulkRegister: true,
});

export default client; // Export the client instance
console.log('Bot is starting...');
client.login(process.env.TOKEN);