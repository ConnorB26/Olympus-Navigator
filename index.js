const { Client, GatewayIntentBits, REST, Routes } = require('discord.js')
require('dotenv/config')

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

client.on('messageCreate', (message) => {
    if(message.content === 'ping')
    {
        message.reply({
            content: 'pong'
        })
    }
})

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()) {
        console.log('Hello, World');
        interaction.reply({ content: 'Hey there!'})
    }
})

async function main() {
    const commands = [
        {
            name: 'order',
            description: 'Order something...'
        },
    ];
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
          body: commands,
        });
        client.login(TOKEN);
    } catch (err) {
        console.log(err);
    }
}

main();