import { SlashCommandBuilder } from '@discordjs/builders';

const listCommands = new SlashCommandBuilder()
    .setName('list').setDescription('Show goals')
    .addSubcommand(subcommand =>
        subcommand.setName('all').setDescription('Show all personal and club goals')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('club').setDescription('Show only club goals')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('personal').setDescription('Show only personal goals')
    )

export default listCommands.toJSON();