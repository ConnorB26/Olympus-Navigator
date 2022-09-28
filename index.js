import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import GoalCommand from './commands/goal.js';

config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()) {
        console.log(interaction.commandName);
        if(interaction.commandName === 'goals') {
            interaction.reply({content: 'Added goal to your profile'});
            // Update database
            // Display goals
        }
    }
});

async function main() {
    const commands = [GoalCommand];
    try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
          body: commands,
        });
        client.login(TOKEN);
    } catch (err) {
        console.log(err);
    }
}

main();