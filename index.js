import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { DefaultRestOptions, REST } from '@discordjs/rest';
import { Sequelize } from 'sequelize';
import UserCommands from './commands/goal.js';
import ClubCommands from './commands/club.js';
import AdminCommands from './commands/admin.js';
import ListCommands from './commands/list.js';

config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
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
        type: Sequelize.STRING,
        unique: true
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
    if(!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if(commandName === 'add') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');
        const stars = interaction.options.getInteger('stars');
        const gearTier = interaction.options.getInteger('gear_tier');
        const tag = interaction.options.getString('tag');

        if(await playerGoals.findOne({ where: { user: user, character: character } })) {
            return interaction.reply(`Goal for ${character} already exists.`);
        }

        await playerGoals.create({
            user: user,
            character: character,
            goalStars: stars,
            goalGearTier: gearTier,
            tag: tag || ''
        });

        return interaction.reply(`Added goal for ${character}`);
    }

    if(commandName === 'edit') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');
        const stars = interaction.options.getInteger('stars');
        const gearTier = interaction.options.getInteger('gear_tier');
        const tag = interaction.options.getString('tag');

        const goal = await playerGoals.findOne({ where: { user: user, character: character } });
        if(goal.clubGoal) {
            return interaction.reply(`You don't have permissions to edit the club goal for ${character}.`);
        }

        const affectedRows = await playerGoals.update({
            goalStars: stars || goal.goalStars,
            goalGearTier: gearTier || goal.goalGearTier,
            tag: tag || goal.tag
        }, { where: { user: user, character: character } })

        checkComplete(user, character);

        if(affectedRows > 0) {
            return interaction.reply(`Edited goal for ${character}.`);
        }
        else {
            return interaction.reply(`Goal for ${character} does not exist. Try creating one instead by using the /add command.`);
        }
    }

    if(commandName === 'progress') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');
        const stars = interaction.options.getInteger('stars');
        const gearTier = interaction.options.getInteger('gear_tier');

        const affectedRows = await playerGoals.update({
            currentStars: stars,
            currentGearTier: gearTier
        }, { where: { user: user, character: character } })

        checkComplete(user, character);

        if(affectedRows > 0) {
            return interaction.reply(`Updated progress on goal for ${character}.`);
        }
        else {
            return interaction.reply(`Goal for ${character} does not exist. Try creating one instead by using the /add command.`);
        }
    }

    if(commandName === 'complete') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');

        const goal = await playerGoals.findOne({ where: { user: user, character: character } });

        const affectedRows = await playerGoals.update({
            currentStars: goal.goalStars,
            currentGearTier: goal.goalGearTier
        }, { where: { user: user, character: character } })

        checkComplete(user, character);

        if(affectedRows > 0) {
            return interaction.reply(`Completed goal for ${character}.`);
        }
        else {
            return interaction.reply(`Goal for ${character} does not exist. Try creating one instead by using the /add command.`);
        }
    }

    if(commandName === 'remove') {
        const user = interaction.user.username;
        const character = interaction.options.getString('character');

        const goal = await playerGoals.findOne({ where: { user: user, character: character } });
        if(goal.clubGoal) {
            return interaction.reply(`You don't have permissions to remove the club goal for ${character}.`);
        }

        const rowCount = await playerGoals.destroy({ where: { user: user, character: character } });

	    if (!rowCount) {
            return interaction.reply(`You currently don't have a goal for ${character} to remove.`);
        }

	    return interaction.reply(`Goal for ${character} deleted.`);
    }

    if(commandName === 'list') {
        let goals;
        if(interaction.options.getSubcommand() === 'all') {
            goals = await playerGoals.findAll({ where: { user: interaction.user.username } });
        }
        else if(interaction.options.getSubcommand() === 'club') {
            goals = await playerGoals.findAll({ where: { user: interaction.user.username, clubGoal: true } });
        }
        else if(interaction.options.getSubcommand() === 'self') {
            goals = await playerGoals.findAll({ where: { user: interaction.user.username, clubGoal: false } });
        }
        
        const goalsString = stringifyGoals(goals);
        
        return interaction.reply(goalsString);
    }

    if(commandName === 'user') {
        if(!interaction.member.roles.cache.some(role => role.id == '857735222804217886')) {
            interaction.reply({content: 'You do not have access to this command.'})
        }
        else {
            if(interaction.options.getSubcommand() === 'list') {
                const users = await playerGoals.findAll({
                    attributes: ['user'],
                    group: ['user']
                })
                interaction.reply({content: users.map(t => t.user).join('\n')});
            }
    
            if(interaction.options.getSubcommand() === 'remove') {
                const user = interaction.user.username;
                const rowCount = await Tags.destroy({ where: { user: user } });
    
                if (!rowCount) {
                    interaction.reply(`${user} does not have any goals.`);
                }
        
                interaction.reply(`All goals for ${user} have been deleted.`);
            }
    
            if(interaction.options.getSubcommand() === 'get') {
                const user = interaction.options.getUser('user').username;
                const type = interaction.options.getString('type');
                let goals;
                if(type === 'All') {
                    goals = await playerGoals.findAll({ where: { user: user } });
                }
                else if (type === 'Club') {
                    goals = await playerGoals.findAll({ where: { user: user, clubGoal: true } });
                }
                else if (type === 'Personal') {
                    goals = await playerGoals.findAll({ where: { user: user, clubGoal: false } });
                }
    
                const goalsString = stringifyGoals(goals);
            
                interaction.reply({content: goalsString});
            }
        }
    }

    if(commandName === 'club') {
        interaction.guild.members.fetch();
        if(!interaction.member.roles.cache.some(role => role.id === 'Admin')) {
            return interaction.reply('You do not have access to this command.')
        }
        else {
            const members = interaction.guild.roles.cache.get('857737478383337473').members.map(m => m.user.username) // 1024796574376796170
            if(interaction.options.getSubcommand() === 'add') {
                const character = interaction.options.getString('character');
                const stars = interaction.options.getInteger('stars');
                const gearTier = interaction.options.getInteger('gear_tier');
                const tag = interaction.options.getString('tag');
        
                if(await playerGoals.findOne({ where: { character: character, clubGoal: true } })) {
                    return interaction.reply(`Club goal for ${character} already exists.`)
                }
        
                members.forEach(user => {
                    playerGoals.create({
                        user: user,
                        character: character,
                        goalStars: stars,
                        goalGearTier: gearTier,
                        tag: tag || '',
                        clubGoal: true
                    })
                });
        
                return interaction.reply(`Added club goal for ${character}`);
            }
            else if(interaction.options.getSubcommand() === 'edit') {
                const character = interaction.options.getString('character');
                const stars = interaction.options.getInteger('stars');
                const gearTier = interaction.options.getInteger('gear_tier');
                const tag = interaction.options.getString('tag');

                const goalClub = await playerGoals.findOne({ where: { character: character, clubGoal: true } });
                if(!goalClub) {
                    return interaction.reply(`Club goal for ${character} does not exist. Try creating one instead by using the /club add command.`);
                }

                members.forEach(user => {
                    playerGoals.update({
                        goalStars: stars || goalClub.goalStars,
                        goalGearTier: gearTier || goalClub.goalGearTier,
                        tag: tag || goalClub.tag
                    }, { where: { user: user, character: character } });
    
                    checkComplete(user, character);
                });

                return interaction.reply(`Edited club goal for ${character}.`);
            }
            else if(interaction.options.getSubcommand() === 'remove') {
                const character = interaction.options.getString('character');

                const rowCount = await playerGoals.destroy({ where: { character: character, clubGoal: true } });

                if (!rowCount) {
                    interaction.reply(`There isn't currently a club goal for ${character} to remove.`);
                }

                return interaction.reply(`Club goal for ${character} deleted.`);
            }
        }
    }
});

function stringifyGoals(goals) {
    return goals.map(t => t.character + ' ' + t.currentStars + '/' + t.goalStars + ' :star: ' + t.currentGearTier + '/' + t.goalGearTier + ' :gear:').join('\n') || 'No goals found.';
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

async function main() {
    const commands = [ClubCommands, AdminCommands, ListCommands].concat(UserCommands);
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