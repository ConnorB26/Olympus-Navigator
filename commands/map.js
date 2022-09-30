import { SlashCommandBuilder } from '@discordjs/builders';

const mapCommands = new SlashCommandBuilder()
    .setName('map').setDescription('Get possible expedition maps for specified floor')
    .addIntegerOption((option) =>
        option.setName('floor').setDescription('Expedition Floor').setRequired(true).setChoices(
            {name: 'Floor 1', value: 1},
            {name: 'Floor 2', value: 2},
            {name: 'Floor 3', value: 3},
            {name: 'Floor 4', value: 4},
            {name: 'Floor 5', value: 5}
        )
    )

export default mapCommands.toJSON();