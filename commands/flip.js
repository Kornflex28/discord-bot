require('dotenv').config();
const Userflip = require("../database/uf.js");
Userflip.setURL(process.env.LEVELS_DB_URL);

const moment = require('moment');
const interval = 24*3600*1000 //ms

const Discord = require('discord.js');
const leaderboard = require('./leaderboard.js');


module.exports = {
    name: 'flip',
    description: 'Lance un dé à deux faces (une pièce). Si ça tombe sur Face tu gagnes un point, sinon ton score retombe à zéro (0).Tu ne peux faire qu\'un lancer par 24h',
    aliases: ['coin', 'pile', 'face'],
    usage: '<> pour jouer ou <"score" @user> pour avoir le score d\'un joueur ou <"lb"> pour le leaderboard de la guilde',
    guildOnly: true,
    cooldown: 2,
    async execute(message, args) {
        const msgTimestamp = Date(message.createdTimestamp)
        let userFlip = await Userflip.fetch(message.author.id, message.guild.id)

        if (args[0] == 'lb') {
            let scores = await Userflip.fetchGuildFlips(message.guild.id);
            scores.sort((userFlipA, userFlipB) => {
                if (userFlipA['best'] < userFlipB['best']) { return -1 }
                if (userFlipA['best'] > userFlipB['best']) { return 1 }
                return 0
            })
            let leaderboard = new Discord.MessageEmbed()
                .setTitle(`Leaderboard de ${message.guild.name} au lancer de dé à deux faces`)
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.guild.iconURL())
                .addField('Meilleurs scores', scores.slice(0, 10).map(uf => `${message.guild.members.cache.get(uf['userID']).user.username}: ${uf['best']}`).join('\n'), true)
                .addField('Scores actuels', scores.sort((userFlipA, userFlipB) => {
                    if (userFlipA['score'] < userFlipB['score']) { return -1 }
                    if (userFlipA['score'] > userFlipB['score']) { return 1 }
                    return 0
                }).slice(0, 10).map(uf => `${message.guild.members.cache.get(uf['userID']).user.username}: ${uf['score']}`).join('\n'), true)
                .setFooter('Le hasard bavarde, le génie écoute.',message.client.user.displayAvatarURL())

            message.channel.send(leaderboard)
        }
        else if (args[0] == 'score') {
            const mentionnedUser = message.mentions.users.first();
            if (!mentionnedUser) {
                if (!userFlip) {
                    return message.channel.send('Il me semble que tu n\'as pas encore tenté ta chance au lancé de dé à deux faces essaye `!flip`')
                }
                else {
                    return message.channel.send(`Ton score actuel est **${userFlip.score}** et ton meilleur score est **${userFlip.best}**.`)
                }
            } else {
                if (message.guild.me.id === mentionnedUser.id) {
                    return message.channel.send('Inutile de me demander mon score, un simple être humain ne pourrai l\'appréhender...')
                }
                userFlip = await Userflip.fetch(mentionnedUser.id, message.guild.id)
                if (!userFlip) {
                    return message.channel.send(`Il me semble que ${mentionnedUser} n\'as pas encore tenté ta chance au lancé de dé à deux faces.`)
                }
                else {
                    return message.channel.send(`Le score actuel de ${mentionnedUser} est **${userFlip.score}** et son meilleur score est **${userFlip.best}**.`)
                }
            }
        }
        else {
            const timeDifference = moment(message.createdTimestamp).diff(userFlip.lastUpdated, 'milliseconds')
            if (timeDifference >= interval) {
                if (Math.random() <= .5) {
                    userFlip = await Userflip.addFlip(message.author.id, message.guild.id, 1, msgTimestamp)
                    return message.channel.send(`🌕 **Face !**\nCoup de chance c'est ${userFlip.score < 2 ? 'ta première face d\'une longue lignée' : `ta **${userFlip.score}ème Face de suite**`} !`)
                } else {
                    userFlip = await Userflip.addFlip(message.author.id, message.guild.id, 0, msgTimestamp)
                    return message.channel.send(`🌑 **Pile !**\nDommage... Ton plus grand nombre de Face à la suite est **${userFlip.best}**.`)
                }
            } else {
                const d = moment.duration(interval - timeDifference);
                const days = d.days();
                const hours = d.hours();
                const minutes = d.minutes();
                const seconds = d.seconds();
                let time = `${days > 0 ? `${days} ${days == 1 ? `jour, ` : 'jours, '}` : ``}${hours > 0 ? `${hours} ${hours == 1 ? 'heure, ' : 'heures, '}` : ``}${minutes > 0 ? `${minutes} ${minutes == 1 ? 'minute, ' : 'minutes, '}` : ``}${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`
                return message.reply(`Addict.e ?! Désolé mais il te faut attendre encore **${time}** avant de retenter ta chance !`)
            }

        }
    }
}