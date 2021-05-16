require('dotenv').config();
const Userflip = require("../database/uf.js");
Userflip.setURL(process.env.LEVELS_DB_URL);

const Usercommands = require("../database/uc.js");
Usercommands.setURL(process.env.LEVELS_DB_URL);

const moment = require('moment');
const interval = process.env.IS_HEROKU ? 24 * 3600 * 1000 : 1000 //ms


const Discord = require('discord.js');
const fs = require('fs');
const userCommands = require('../database/user-commands.js');
const locales = JSON.parse(fs.readFileSync('./locales/fr-FR.json').toString());
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}


module.exports = {
    name: 'flip',
    description: 'Lance un dé à deux faces (une pièce). Si ça tombe sur Face tu gagnes un point, sinon ton score retombe à zéro (0).Tu ne peux faire qu\'un lancer par 24h',
    aliases: ['coin', 'pile', 'face'],
    usage: '<> pour jouer ou <"score" @user> pour avoir le score d\'un.e joueur.euse ou <"lb"> pour le leaderboard du serveur',
    guildOnly: true,
    cooldown: 2,
    async execute(message, args) {

        const msgTimestamp = Date(message.createdTimestamp)
        let userFlip = await Userflip.fetch(message.author.id, message.guild.id)
        let prevScore = userFlip?userFlip.score:0;
        if (args[0] == 'lb') {
            let scores = await Userflip.fetchGuildFlips(message.guild.id);
            if (!scores.length) {
                return message.reply('Il semble que personne n\'ai joué dans ce serveur...')
            }
            scores.sort((userFlipA, userFlipB) => userFlipB['best'] - userFlipA['best'])
            let leaderboard = new Discord.MessageEmbed()
                .setTitle(`Leaderboard de ${message.guild.name} au lancer de dé à deux faces`)
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.guild.iconURL())
                .addField('Meilleurs scores', scores.slice(0, 10).map(uf => `${message.guild.members.cache.get(uf['userID']).user.username}:`).join('\n'), true) 
                .addField('** **', scores.slice(0, 10).map(uf => `🌕 ${uf['best']} / 🌑 ${uf['best_bad']}`).join('\n'), true)
                .addField('\u200b', '\u200b', true)
                .addField('Scores actuels', scores.sort((userFlipA, userFlipB) => userFlipB['score'] - userFlipA['score']).slice(0, 10).map(uf => `${message.guild.members.cache.get(uf['userID']).user.username}:`).join('\n'), true)
                .addField('** **', scores.slice(0, 10).map(uf =>`🌕 ${uf['score']} / 🌑 ${uf['score_bad']}`).join('\n'), true)
                .addField('\u200b', '\u200b', true)
                .setFooter('Le hasard bavarde, le génie écoute.', message.client.user.displayAvatarURL())

            message.channel.send(leaderboard)
        }
        else if (args[0] == 'score') {
            const mentionnedUser = message.mentions.users.first();
            if (!mentionnedUser) {
                if (!userFlip) {
                    return message.channel.send('Il me semble que tu n\'as pas encore tenté ta chance au lancer de dé à deux faces essaye `!flip`')
                }
                else {
                    let user_commands = await Usercommands.fetch(message.author.id,message.guild.id);
                    return message.channel.send(`Ton score actuel est **${userFlip.score}** et ton meilleur score est **${userFlip.best}**. Tu as fait ${user_commands.commands.get('flip')} lancers au total!`)
                }
            } else {
                if (message.guild.me.id === mentionnedUser.id) {
                    return message.channel.send('Inutile de me demander mon score, un simple être humain ne pourrai l\'appréhender...')
                }
                userFlip = await Userflip.fetch(mentionnedUser.id, message.guild.id)
                if (!userFlip) {
                    return message.channel.send(`Il me semble que ${mentionnedUser.user.username} n\'as pas encore tenté ta chance au lancer de dé à deux faces.`)
                }
                else {
                    let user_commands = await Usercommands.fetch(mentionnedUser.id,message.guild.id);
                    return message.channel.send(`Le score actuel de ${mentionnedUser.user.username} est **${userFlip.score}** et son meilleur score est **${userFlip.best}**. Avec un total de ${user_commands.commands.get('flip')} lancers!`)
                }
            }
        }
        else {
            if (!userFlip) {
                if (Math.random() <= .5) {
                    userFlip = await Userflip.addFlip(message.author.id, message.guild.id, 1, msgTimestamp)
                    return message.channel.send(`🌕 **${locales.flips.heads.random()} !**\nCoup de chance c'est ${userFlip.score < 2 ? 'ta première face d\'une longue lignée' : `ta **${userFlip.score}ème Face de suite**`} !`)
                } else {
                    userFlip = await Userflip.addFlip(message.author.id, message.guild.id, -1, msgTimestamp)
                    return message.channel.send(`🌑 **${locales.flips.tails.random()} !**\nDommage...\nTu en étais à ${prevScore} Face à la suite et ton meilleur score est **${userFlip.best}**.`)
                }
            }
            const timeDifference = moment(message.createdTimestamp).diff(userFlip.lastUpdated, 'milliseconds')
            if (timeDifference >= interval) {
                if (Math.random() <= .5) {
                    userFlip = await Userflip.addFlip(message.author.id, message.guild.id, 1, msgTimestamp)
                    return message.channel.send(`🌕 **${locales.flips.heads.random()} !**\nCoup de chance c'est ${userFlip.score < 2 ? 'ta première face d\'une longue lignée' : `ta **${userFlip.score}ème Face de suite**`} !`)
                } else {
                    userFlip = await Userflip.addFlip(message.author.id, message.guild.id, -1, msgTimestamp)
                    return message.channel.send(`🌑 **${locales.flips.tails.random()} !**\nDommage... ${userFlip.score_bad > 1 ? `Vraiment pas de chance c\'est la ${userFlip.score_bad}ème fois de suite que tu rates` : ''}\nTu en étais à ${prevScore} Face à la suite et ton meilleur score est **${userFlip.best}**.`)
                }
            } else {
                const d = moment.duration(interval - timeDifference);
                const days = d.days();
                const hours = d.hours();
                const minutes = d.minutes();
                const seconds = d.seconds();
                let time = `${days > 0 ? `${days} ${days == 1 ? `jour, ` : 'jours, '}` : ``}${hours > 0 ? `${hours} ${hours == 1 ? 'heure, ' : 'heures, '}` : ``}${minutes > 0 ? `${minutes} ${minutes == 1 ? 'minute, ' : 'minutes, '}` : ``}${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`
                return message.reply(`${locales.flips.time.random()} Désolé mais il te faut attendre encore **${time}** avant de retenter ta chance !`)
            }

        }
    }
}
