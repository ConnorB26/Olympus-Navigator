import { SlashCommandBuilder } from '@discordjs/builders';

const addCommand = new SlashCommandBuilder()
    .setName('add').setDescription('Add a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true)
        // Get options from database (character that doesn't exist already in goals)
    )
    .addIntegerOption((option) =>
        option.setName('stars').setDescription('Stars').setRequired(true).setChoices(
            {name: '0 Stars (not unlocked)', value: 0},
            {name: '1 Star', value: 1},
            {name: '2 Stars', value: 2},
            {name: '3 Stars', value: 3},
            {name: '4 Stars', value: 4},
            {name: '5 Stars', value: 5},
            {name: '6 Stars', value: 6},
            {name: '7 Stars', value: 7})
    )
    .addIntegerOption((option) =>
        option.setName('gear_tier').setDescription('Gear tier').setRequired(true).setChoices(
            {name: 'Gear Tier 0 (not unlocked)', value: 0},
            {name: 'Gear Tier 1', value: 1},
            {name: 'Gear Tier 2', value: 2},
            {name: 'Gear Tier 3', value: 3},
            {name: 'Gear Tier 4', value: 4},
            {name: 'Gear Tier 5', value: 5},
            {name: 'Gear Tier 6', value: 6},
            {name: 'Gear Tier 7', value: 7},
            {name: 'Gear Tier 8', value: 8},
            {name: 'Gear Tier 9', value: 9})
    )
    .addStringOption((option) =>
        option.setName('tag').setDescription('Goal grouping tag')
    )

const editCommand = new SlashCommandBuilder()
    .setName('edit').setDescription('Edit a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true)
        // Get options from database (must already have a goal for)
    )
    .addIntegerOption((option) =>
        option.setName('stars').setDescription('Stars').setChoices(
            {name: '0 Stars (not unlocked)', value: 0},
            {name: '1 Star', value: 1},
            {name: '2 Stars', value: 2},
            {name: '3 Stars', value: 3},
            {name: '4 Stars', value: 4},
            {name: '5 Stars', value: 5},
            {name: '6 Stars', value: 6},
            {name: '7 Stars', value: 7})
    )
    .addIntegerOption((option) =>
        option.setName('gear_tier').setDescription('Gear tier').setChoices(
            {name: 'Gear Tier 0 (not unlocked)', value: 0},
            {name: 'Gear Tier 1', value: 1},
            {name: 'Gear Tier 2', value: 2},
            {name: 'Gear Tier 3', value: 3},
            {name: 'Gear Tier 4', value: 4},
            {name: 'Gear Tier 5', value: 5},
            {name: 'Gear Tier 6', value: 6},
            {name: 'Gear Tier 7', value: 7},
            {name: 'Gear Tier 8', value: 8},
            {name: 'Gear Tier 9', value: 9})
    )
    .addStringOption((option) =>
        option.setName('tag').setDescription('Goal grouping tag')
    )

const progressCommand = new SlashCommandBuilder()
    .setName('progress').setDescription('Set progress on a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true)
        // Get options from database (must already have a goal for)
    )
    .addIntegerOption((option) =>
        option.setName('stars').setDescription('Stars').setRequired(true).setChoices(
            {name: '0 Stars (not unlocked)', value: 0},
            {name: '1 Star', value: 1},
            {name: '2 Stars', value: 2},
            {name: '3 Stars', value: 3},
            {name: '4 Stars', value: 4},
            {name: '5 Stars', value: 5},
            {name: '6 Stars', value: 6},
            {name: '7 Stars', value: 7})
    )
    .addIntegerOption((option) =>
        option.setName('gear_tier').setDescription('Gear tier').setRequired(true).setChoices(
            {name: 'Gear Tier 0 (not unlocked)', value: 0},
            {name: 'Gear Tier 1', value: 1},
            {name: 'Gear Tier 2', value: 2},
            {name: 'Gear Tier 3', value: 3},
            {name: 'Gear Tier 4', value: 4},
            {name: 'Gear Tier 5', value: 5},
            {name: 'Gear Tier 6', value: 6},
            {name: 'Gear Tier 7', value: 7},
            {name: 'Gear Tier 8', value: 8},
            {name: 'Gear Tier 9', value: 9})
    )

const removeCommand = new SlashCommandBuilder()
    .setName('remove').setDescription('Remove a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true)
        // Get options from database (must already have a goal for)
    )

const completeCommand = new SlashCommandBuilder()
    .setName('complete').setDescription('Mark a goal as complete')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true)
        // Get options from database (must already have a goal for)
    )

export default [addCommand.toJSON(), editCommand.toJSON(), progressCommand.toJSON(), removeCommand.toJSON(), completeCommand.toJSON()];