import { SlashCommandBuilder } from '@discordjs/builders';

const commandCommand = new SlashCommandBuilder()
    .setName('commands').setDescription('Get list of all accessible commands')

export default commandCommand.toJSON();