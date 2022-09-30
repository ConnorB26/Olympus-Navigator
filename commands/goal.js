import { SlashCommandBuilder } from '@discordjs/builders';
import stars from './choices/stars.js';
import gear from './choices/gear.js';

const addCommand = new SlashCommandBuilder()
    .setName('add').setDescription('Add a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true).setAutocomplete(true))
    .addIntegerOption((option) => {
        option.setName('stars').setDescription('Stars').setRequired(true)

        for(var i = 1; i < stars.length; i++) {
            option.addChoices({name: stars[i].name, value: stars[i].value})
        }

        return option;
    })
    .addIntegerOption(option => {
        option.setName('gear_tier').setDescription('Gear tier').setRequired(true)

        for(var i = 1; i < gear.length; i++) {
            option.addChoices({name: gear[i].name, value: gear[i].value})
        }

        return option;
    })
    .addStringOption((option) =>
        option.setName('tag').setDescription('Goal grouping tag')
    )

const editCommand = new SlashCommandBuilder()
    .setName('edit').setDescription('Edit a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true).setAutocomplete(true)
    )
    .addIntegerOption((option) => {
        option.setName('stars').setDescription('Stars').setRequired(true)

        for(var i = 1; i < stars.length; i++) {
            option.addChoices({name: stars[i].name, value: stars[i].value})
        }

        return option;
    })
    .addIntegerOption(option => {
        option.setName('gear_tier').setDescription('Gear tier').setRequired(true)

        for(var i = 1; i < gear.length; i++) {
            option.addChoices({name: gear[i].name, value: gear[i].value})
        }

        return option;
    })
    .addStringOption((option) =>
        option.setName('tag').setDescription('Goal grouping tag')
    )

const progressCommand = new SlashCommandBuilder()
    .setName('progress').setDescription('Set progress on a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true).setAutocomplete(true)
    )
    .addIntegerOption((option) => {
        option.setName('stars').setDescription('Stars').setRequired(true)

        for(var i = 0; i < stars.length; i++) {
            option.addChoices({name: stars[i].name, value: stars[i].value})
        }

        return option;
    })
    .addIntegerOption(option => {
        option.setName('gear_tier').setDescription('Gear tier').setRequired(true)

        for(var i = 0; i < gear.length; i++) {
            option.addChoices({name: gear[i].name, value: gear[i].value})
        }

        return option;
    })

const removeCommand = new SlashCommandBuilder()
    .setName('remove').setDescription('Remove a goal')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true).setAutocomplete(true)
    )

const completeCommand = new SlashCommandBuilder()
    .setName('complete').setDescription('Mark a goal as complete')
    .addStringOption((option) =>
        option.setName('character').setDescription('Character').setRequired(true).setAutocomplete(true)
    )

export default [addCommand.toJSON(), editCommand.toJSON(), progressCommand.toJSON(), removeCommand.toJSON(), completeCommand.toJSON()];