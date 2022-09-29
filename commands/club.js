import { SlashCommandBuilder } from '@discordjs/builders';

const maxGearTier = 9;

const clubCommands = new SlashCommandBuilder()
    .setName('club').setDescription('Set club goal information')
    .addSubcommand(subcommand =>
        subcommand.setName('add').setDescription('Add a club goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (character that doesn't exist already in goals)
        )
        .addIntegerOption((option) =>
            option.setName('stars').setDescription('Stars').setRequired(true)
            .setMinValue(1).setMaxValue(7)
        )
        .addIntegerOption((option) =>
            option.setName('gear_tier').setDescription('Gear tier').setRequired(true)
            .setMinValue(1).setMaxValue(maxGearTier)
        )
        .addStringOption((option) =>
            option.setName('tag').setDescription('Goal grouping tag')
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('edit').setDescription('Edit a club goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (must already have a goal for)
        )
        .addIntegerOption((option) =>
            option.setName('stars').setDescription('Stars')
            .setMinValue(1).setMaxValue(7)
        )
        .addIntegerOption((option) =>
            option.setName('gear_tier').setDescription('Gear tier')
            .setMinValue(1).setMaxValue(maxGearTier)
        )
        .addStringOption((option) =>
            option.setName('tag').setDescription('Goal grouping tag')
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove').setDescription('Remove a club goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true)
            // Get options from database (must already have a goal for)
        )
    )

export default clubCommands.toJSON();