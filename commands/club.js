import { SlashCommandBuilder } from '@discordjs/builders';
import stars from './choices/stars.js';
import gear from './choices/gear.js';

const clubCommands = new SlashCommandBuilder()
    .setName('club').setDescription('Set club goal information')
    .addSubcommand(subcommand =>
        subcommand.setName('add').setDescription('Add a club goal')
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
    )
    .addSubcommand(subcommand =>
        subcommand.setName('edit').setDescription('Edit a club goal')
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
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove').setDescription('Remove a club goal')
        .addStringOption((option) =>
            option.setName('character').setDescription('Character').setRequired(true).setAutocomplete(true)
        )
    )

export default clubCommands.toJSON();