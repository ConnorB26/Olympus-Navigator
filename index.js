import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes, EmbedBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Sequelize } from 'sequelize';
import _, { map } from 'underscore';
import UserCommands from './commands/goal.js';
import ClubCommands from './commands/club.js';
import AdminCommands from './commands/admin.js';
import ListCommands from './commands/list.js';
import MapCommands from './commands/map.js';
import CommandCommands from './commands/command.js';
import characters from './commands/choices/characters.js';
import commands from './commands/choices/commands.js';

config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

//sequelize.drop('playerGoals');

const playerGoals = sequelize.define('playerGoals', {
	user: Sequelize.STRING,
	character: {
        type: Sequelize.STRING
    },
    currentStars: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    currentGearTier: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    goalStars: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    goalGearTier: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tag: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    clubGoal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => {
    playerGoals.sync();
    console.log(`${client.user.tag} has logged in!`);
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isAutocomplete()) return;

    const user = interaction.user.username;
    const { commandName } = interaction;

    const focusedOption = interaction.options.getFocused(true);
    let choices;

    if(commandName === 'add') {
        if(focusedOption.name === 'character') {
            choices = await getCharactersWithoutGoal(user, false);
        }
    }

    if(commandName === 'edit' || commandName === 'remove') {
        if(focusedOption.name === 'character') {
            choices = await getCharactersWithGoal(user, false);
        }
    }

    if(commandName === 'progress' || commandName === 'complete') {
        if(focusedOption.name === 'character') {
            choices = await getCharactersWithGoal(user, false, true);
        }
    }

    if(commandName === 'club') {
        if(interaction.options.getSubcommand() === 'add') {
            if(focusedOption.name === 'character') {
                choices = await getCharactersWithoutGoal(user, true);
            }
        }

        else if(interaction.options.getSubcommand() === 'edit' || interaction.options.getSubcommand() === 'remove') {
            if(focusedOption.name === 'character') {
                choices = await getCharactersWithGoal(user, true);
            }
        }
    }

    const filtered = choices.filter(choice => choice.startsWith(focusedOption.value)).slice(0, 25);
    await interaction.respond(
        filtered.map(choice => ({name: choice, value: choice}))
    )
});

const ephemeral = true;
client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    await interaction.guild.members.fetch();
    const admin = interaction.member.roles.cache.some(role => role.id === '857735222804217886') || interaction.member.roles.cache.some(role => role.id === '1025082187470618746');

    const { commandName } = interaction;
    
    if(commandName === 'map') {
        if(!admin) {
            return interaction.reply('You do not have access to this command.');
        }

        const floor = interaction.options.getInteger('floor');
        return interaction.reply(`Retrieving possible maps for expedition floor ${floor}...`);
    }

    if(commandName === 'add') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');
        const stars = interaction.options.getInteger('stars');
        const gearTier = interaction.options.getInteger('gear_tier');
        const tag = interaction.options.getString('tag');

        if(await playerGoals.findOne({ where: { user: user, character: character } })) {
            return interaction.reply({content:`Goal for ${character} already exists.`, ephemeral: ephemeral})
        }

        return interaction.reply({content: await addGoal(user, character, stars, gearTier, tag, false), ephemeral: ephemeral});
    }

    if(commandName === 'edit') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');
        const stars = interaction.options.getInteger('stars');
        const gearTier = interaction.options.getInteger('gear_tier');
        const tag = interaction.options.getString('tag');

        const goal = await playerGoals.findOne({ where: { user: user, character: character } });
        if(goal.clubGoal) {
            if(admin) {
                return interaction.reply({content: 'To edit a club goal, use /club edit.', ephemeral: ephemeral})
            }
            else {
                return interaction.reply({content: 'You do not have permission to edit a club goal assigned to you.', ephemeral: ephemeral})
            }
        }

        return interaction.reply({content: await editGoal(user, character, stars, gearTier, tag, false, false), ephemeral: ephemeral});
    }

    if(commandName === 'progress') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');
        const stars = interaction.options.getInteger('stars');
        const gearTier = interaction.options.getInteger('gear_tier');

        return interaction.reply({content: await progressGoal(user, character, stars, gearTier), ephemeral: ephemeral});
    }

    if(commandName === 'complete') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');

        return interaction.reply({content: await completeGoal(user, character), ephemeral: ephemeral});
    }

    if(commandName === 'remove') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');

        const goal = await playerGoals.findOne({ where: { user: user, character: character } });
        if(goal.clubGoal) {
            if(admin) {
                return interaction.reply({content: 'To remove a club goal, use /club remove.', ephemeral: ephemeral})
            }
            else {
                return interaction.reply({content: 'You do not have permission to remove a club goal assigned to you.', ephemeral: ephemeral})
            }
        }

        return interaction.reply({content: await removeGoal(user, character, true), ephemeral: ephemeral});
    }

    if(commandName === 'list') {
        const user = interaction.user.username;
        let type;
        if(interaction.options.getSubcommand() === 'all') {
            type = 'All';
        }
        else if(interaction.options.getSubcommand() === 'club') {
            type = 'Club';
        }
        else if(interaction.options.getSubcommand() === 'personal') {
            type = 'Personal';
        }
        interaction.reply({embeds: await displayUserGoals(user, type), ephemeral: ephemeral});
    }

    if(commandName === 'user') {
        if(!admin) {
            interaction.reply({content: 'You do not have access to this command.', ephemeral: ephemeral})
        }
        else {
            if(interaction.options.getSubcommand() === 'list') {
                const users = await playerGoals.findAll({
                    attributes: ['user'],
                    group: ['user']
                })

                const res = users.map(t => t.user).join(', ') || 'No users have any goals.';

                const userEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('User Stats')
                    .addFields({ name: 'Users: ' + users.length, value: res, inline: true })

                interaction.reply({embeds: [userEmbed], ephemeral: ephemeral});
            }
    
            if(interaction.options.getSubcommand() === 'remove') {
                const user = interaction.options.getUser('user').username;
                const rowCount = await playerGoals.destroy({ where: { user: user } });
    
                if (!rowCount) {
                    interaction.reply({content: `${user} does not have any goals.`, ephemeral: ephemeral});
                }
        
                interaction.reply({content: `All goals for ${user} have been deleted.`, ephemeral: ephemeral});
            }
    
            if(interaction.options.getSubcommand() === 'get') {
                const user = interaction.options.getUser('user').username;
                const type = interaction.options.getString('type');
            
                interaction.reply({embeds: await displayUserGoals(user, type), ephemeral: ephemeral});
            }
        }
    }

    if(commandName === 'club') {
        if(!admin) {
            return interaction.reply({content: 'You do not have access to this command.', ephemeral: ephemeral});
        }
        await interaction.guild.members.fetch();
        const members = interaction.guild.roles.cache.get('857737478383337473').members.map(m => m.user.username)
        if(interaction.options.getSubcommand() === 'add') {
            const character = interaction.options.getString('character');
            const stars = interaction.options.getInteger('stars');
            const gearTier = interaction.options.getInteger('gear_tier');
            const tag = interaction.options.getString('tag');
    
            if(await playerGoals.findOne({ where: { character: character, clubGoal: true } })) {
                return interaction.reply({content: `Club goal for ${character} already exists.`, ephemeral: ephemeral});
            }

            for(const user of members) {
                await addGoal(user, character, stars, gearTier, tag, true);
            }
    
            return interaction.reply({content: `Added club goal for ${character}`, ephemeral: ephemeral});
        }
        else if(interaction.options.getSubcommand() === 'edit') {
            const character = interaction.options.getString('character');
            const stars = interaction.options.getInteger('stars');
            const gearTier = interaction.options.getInteger('gear_tier');
            const tag = interaction.options.getString('tag');

            if(!await playerGoals.findOne({ where: { character: character, clubGoal: true } })) {
                return interaction.reply({content: `Club goal for ${character} does not exist. Try creating one instead by using /club add.`, ephemeral: ephemeral});
            }

            for(const user of members) {
                await editGoal(user, character, stars, gearTier, tag, true, true);
            }

            return interaction.reply({content: `Edited club goal for ${character}.`, ephemeral: ephemeral});
        }
        else if(interaction.options.getSubcommand() === 'remove') {
            const character = interaction.options.getString('character');

            return interaction.reply({content: await removeGoal(null, character, true), ephemeral: ephemeral});
        }
    }

    if(commandName === 'commands') {
        const commandEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Commands')
                    .addFields({ name: 'Standard', value: commands[0].join('\n')})

        if(admin) {
            commandEmbed.addFields({ name: 'Admin', value: commands[1].join('\n')})
        }

        interaction.reply({embeds: [commandEmbed], ephemeral: ephemeral});
    }
});

async function displayUserGoals(user, type) {
    let clubEmbed;
    let personalEmbed;

    if (type === 'Club' || type === 'All') {
        const clubGoals = await playerGoals.findAll({ where: { user: user, clubGoal: true } });
        clubEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Club Goals for ' + user)

        const split = _.toArray(_.groupBy(clubGoals, function(goal) { return goal.tag; }));
        const sortedSplit = _.sortBy(split, function(goal) { return goal[0].tag; });
        sortedSplit.forEach(element => {
            const sortedElement = _.sortBy(element, 'complete');
            const tag = sortedElement[0].tag || 'No Tag';
            clubEmbed.addFields({name: tag, value: stringifyGoals(sortedElement)});
        });
}
    if (type === 'Personal'  || type === 'All') {
        const personalGoals = await playerGoals.findAll({ where: { user: user, clubGoal: false } });
        personalEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Personal Goals for ' + user)

        const split = _.toArray(_.groupBy(personalGoals, function(goal) { return goal.tag; }));
        const sortedSplit = _.sortBy(split, function(goal) { return goal[0].tag; });
        sortedSplit.forEach(element => {
            const sortedElement = _.sortBy(element, 'complete');
            const tag = sortedElement[0].tag || 'No Tag';
            personalEmbed.addFields({name: tag, value: stringifyGoals(sortedElement)});
        });
    }

    if(type === 'Club') {
        return [clubEmbed];
    }
    else if(type === 'Personal') {
        return [personalEmbed];
    }
    else {
        return [clubEmbed, personalEmbed];
    }
}

function stringifyGoals(goals) {
    return goals.map(t => (t.complete ? ':white_check_mark:' : ':x:') + ' ' + t.character + ' ' + t.currentStars + '/' + t.goalStars + ' :star: ' + t.currentGearTier + '/' + t.goalGearTier + ' :gear:').join('\n') || 'No goals found.';
}

async function checkComplete(user, character) {
    const goal = await playerGoals.findOne({ where: { user: user, character: character } });
    if(goal.currentStars >= goal.goalStars && goal.currentGearTier >= goal.goalGearTier) {
        await playerGoals.update({ complete: true }, { where: { user: user, character: character } })
        return true;
    }
    await playerGoals.update({ complete: false }, { where: { user: user, character: character } })
    return false;
}

async function addGoal(user, character, stars, gear, tag, clubGoal) {
    try {
        await playerGoals.create({
            user: user,
            character: character,
            goalStars: stars,
            goalGearTier: gear,
            tag: tag || '',
            clubGoal: clubGoal
        });

        return `Added goal for ${character}`;
    }
    catch (error) {
        return 'Something went wrong with adding goal.';
    }
}

async function editGoal(user, character, stars, gear, tag, clubGoal, admin) {
    if(!admin && clubGoal) {
        return `You don't have permissions to edit the club goal for ${character}.`;
    }

    const goal = await playerGoals.findOne({ where: { user: user, character: character } });
    const affectedRows = await playerGoals.update({
        goalStars: stars || goal.goalStars,
        goalGearTier: gear || goal.goalGearTier,
        tag: tag || goal.tag
    }, { where: { user: user, character: character } })

    checkComplete(user, character);

    if(affectedRows > 0) {
        return `Edited${clubGoal ? ' club' : ''} goal for ${character}.`;
    }
    else {
        return `${clubGoal ? 'Club goal' : 'Goal'} for ${character} does not exist. Try creating one instead by using the /add command.`;
    }
}

async function removeGoal(user, character, clubGoal) {
    let rowCount;
    if(clubGoal) {
        rowCount = await playerGoals.destroy({ where: { character: character, clubGoal: clubGoal } });
    }
    else {
        rowCount = await playerGoals.destroy({ where: { user: user, character: character } });
    }

    if (!rowCount) {
        return `There isn't currently a${clubGoal ? ' club' : ''} goal for ${character} to remove.`;
    }

    return `Club goal for ${character} deleted.`;
}

async function progressGoal(user, character, stars, gear) {
    if(!await playerGoals.findOne({ where: { user: user, character: character } })) {
        return `Goal for ${character} does not exist. Try creating one instead by using the /add command.`;
    }

    await playerGoals.update({
        currentStars: stars,
        currentGearTier: gear
    }, { where: { user: user, character: character } })

    const complete = await checkComplete(user, character);

    if(!complete) {
        return `Updated progress on goal for ${character}.`;
    }
    else {
        return `Completed goal for ${character}.`;
    }
}

async function completeGoal(user, character) {
    const goal = await playerGoals.findOne({ where: { user: user, character: character } });
    if(!goal) {
        return `Goal for ${character} does not exist. Try creating one instead by using the /add command.`;
    }

    return await progressGoal(user, character, goal.goalStars, goal.goalGearTier);
}

async function getCharactersWithoutGoal(user, clubGoal) {
    const goalChars = await getCharactersWithGoal(user, clubGoal, true);
    return characters.filter(char => !goalChars.includes(char));
}

async function getCharactersWithGoal(user, clubGoal, all) {
    let characters;
    if(!all) {
        characters = await playerGoals.findAll({
            attributes: ['character'],
            group: ['character'],
            where: { user: user, clubGoal: clubGoal }
        });
    }
    else {
        characters = await playerGoals.findAll({
            attributes: ['character'],
            group: ['character'],
            where: { user: user }
        });
    }
    const characterList = characters.map(c => c.character);
    return characterList;
}

async function main() {
    const commands = [MapCommands, ClubCommands, AdminCommands, ListCommands, CommandCommands].concat(UserCommands);
    try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
          body: commands,
        });
        client.login(TOKEN);
    } catch (err) {
        console.log(err);
    }
}

main();