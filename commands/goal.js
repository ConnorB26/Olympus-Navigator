import { SlashCommandBuilder } from '@discordjs/builders';

const maxGearTier = 9;

const goalCommand = new SlashCommandBuilder()
    .setName('goals').setDescription('Manage your personal and club goals')
    .addSubcommand(subcommand =>
        subcommand.setName('setup').setDescription('Add yourself to the system')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('add').setDescription('Add a goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (character that doesn't exist already in goals)
        )
        .addIntegerOption((option) =>
            option.setName('stars').setDescription('Stars').setRequired(true)
            .setMinValue(1).setMaxValue(7)
        )
        .addIntegerOption((option) =>
            option.setName('gear_tier').setDescription('Gear Tier').setRequired(true)
            .setMinValue(1).setMaxValue(maxGearTier)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('edit').setDescription('Edit a goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (must already have a goal for)
        )
        .addIntegerOption((option) =>
            option.setName('stars').setDescription('Stars').setRequired(true)
            .setMinValue(1).setMaxValue(7)
        )
        .addIntegerOption((option) =>
            option.setName('gear_tier').setDescription('Gear Tier').setRequired(true)
            .setMinValue(1).setMaxValue(maxGearTier)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('progress').setDescription('Set progress on a goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (must already have a goal for)
        )
        .addIntegerOption((option) =>
            option.setName('stars').setDescription('Stars').setRequired(true)
            .setMinValue(0).setMaxValue(7)
        )
        .addIntegerOption((option) =>
            option.setName('gear_tier').setDescription('Gear Tier').setRequired(true)
            .setMinValue(0).setMaxValue(maxGearTier)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove').setDescription('Remove a goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (must already have a goal for)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('complete').setDescription('Mark a goal as complete')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (must already have a goal for)
        )
    )
    .addSubcommandGroup(group =>
        group.setName('list').setDescription('Show goals')
        .addSubcommand(subcommand =>
            subcommand.setName('all').setDescription('Show all personal and club goals')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('club').setDescription('Show only club goals')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('self').setDescription('Show only personal goals')
        )
    )
    .addSubcommandGroup(group => // admin
        group.setName('user').setDescription('Get user information')
        .addSubcommand(subcommand =>
            subcommand.setName('list').setDescription('Get a list of all of the players who have goals')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove').setDescription('Remove a user and their goals')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('get').setDescription('Get a specific player\'s goals')
            .addUserOption((option) =>
                option.setName('user').setDescription('User').setRequired(true)
            )
        )
    )
    .addSubcommandGroup(group => // admin
        group.setName('club').setDescription('Set club goal information')
        .addSubcommand(subcommand =>
            subcommand.setName('add').setDescription('Add a club goal')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('edit').setDescription('Edit a club goal')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove').setDescription('Remove a club goal')
        )
    )
    ;

export default goalCommand.toJSON();