import { SlashCommandBuilder } from '@discordjs/builders';

const adminCommands = new SlashCommandBuilder()
    .setName('user').setDescription('Get user information')
    .addSubcommand(subcommand =>
        subcommand.setName('list').setDescription('Get a list of all of the players who have goals')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove').setDescription('Remove a user and their goals')
        .addUserOption((option) =>
            option.setName('user').setDescription('User').setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('get').setDescription('Get a specific player\'s goals')
        .addUserOption((option) =>
            option.setName('user').setDescription('User').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('type').setDescription('Get all goals, just their progress on the club goals, or their personal goals').setRequired(true)
            .setChoices(
                {name: 'All', value: "All"},
                {name: 'Club', value: "Club"},
                {name: 'Personal', value: "Personal"}
            )
        )
    )

export default adminCommands.toJSON();