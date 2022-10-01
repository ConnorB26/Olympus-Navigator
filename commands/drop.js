import { SlashCommandBuilder } from '@discordjs/builders';

const dropCommand = new SlashCommandBuilder()
    .setName('drop').setDescription('Drop table for player goals')

export default dropCommand.toJSON();