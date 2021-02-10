const Discord = require('discord.js');
require('dotenv').config();
const fetch = require("node-fetch");
const fetch_url = 'https://the-one-api.dev/v2/';
const movies = new Map([['5cd95395de30eff6ebccde5c', 'La Communauté de l\'Anneau'], ['5cd95395de30eff6ebccde5b', 'Les Deux Tours'], ['5cd95395de30eff6ebccde5d', 'Le Retour du Roi']]);


const LotrScores = require("../database/ls.js");
LotrScores.setURL(process.env.LEVELS_DB_URL);


module.exports = {
    name: 'lotr',
    description: 'Dédé agite ses dés et trouve une citation de l\'iconique trilogie de J.R.R Tolkien',
    cooldown: 2,
    async execute(message, args) {
        if (args[0] === 'lb') {
            let scores = await LotrScores.fetchGuildLotrScores(message.guild.id);
            if (!scores.length) {
                return message.reply('Il semble que personne n\'ai joué dans ce serveur...')
            }
            scores.sort((userScoreA, userScoreB) => userScoreB['wins']/userScoreB['total'] - userScoreA['wins']/userScoreB['total'])
            let leaderboard = new Discord.MessageEmbed()
                .setTitle(`Leaderboard de ${message.guild.name} au jeu LOTR`)
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.guild.iconURL())
                .addField('Meilleurs winrates', scores.slice(0, 10).map(us => `${message.guild.members.cache.get(us['userID']).user.username}: ${(100*us['wins']/us['total']).toFixed(2)}% (${us['wins']}/${us['total']})`).join('\n'), true)
                .setFooter('Ne vous mêlez pas des affaires des magiciens, car ils sont subtils et prompts à la colère.', message.client.user.displayAvatarURL())
                .setTimestamp()

            message.channel.send(leaderboard)

        }
        else if (args[0] == 'score') {
            const mentionnedUser = message.mentions.users.first();
            if (!mentionnedUser) {
                let userScore = await LotrScores.fetch(message.author.id,message.guild.id)
                if (!userScore) {
                    return message.channel.send('Il me semble que tu n\'as pas encore tenté ta chance au jeu, essaye `!lotr`')
                }
                else {
                    return message.channel.send(`Ton score actuel est de **${userScore.wins}** sur un total de ${userScore.total} parties. (winrate: ${(100*userScore.wins/userScore.total).toFixed(2)}%)`)
                }
            } else {
                if (message.guild.me.id === mentionnedUser.id) {
                    return message.channel.send('Inutile de me demander mon score, un simple être humain ne pourrai l\'appréhender...')
                }
                let userScore = await LotrScores.fetch(mentionnedUser.id,message.guild.id)
                if (!userScore) {
                    return message.channel.send(`Il me semble que ${mentionnedUser} n\'as pas encore tenté ta chance au au jeu.`)
                }
                else {
                    return message.channel.send(`Le score actuel de ${mentionnedUser} est de **${userScore.wins}** sur un total de ${userScore.total} parties. (winrate: ${(100*userScore.wins/userScore.total).toFixed(2)}%)`)
                }
            }

        } else {

            fetch(`${fetch_url}quote?limit=2390`, { headers: { 'Authorization': `Bearer ${process.env.LOTR_TOKEN}` } }).then(resp => resp.json())
                .catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon anneau...')
                })
                .then(async json => {
                    let quote = json.docs[Math.floor(Math.random() * json.docs.length)]
                    let movie = await fetch(`${fetch_url}movie/${quote.movie}`, { headers: { 'Authorization': `Bearer ${process.env.LOTR_TOKEN}` } }).then(resp => resp.json()).catch(e => {
                        console.log(e);
                        return message.reply('Désolé je ne trouve plus mon anneau...')
                    })
                    let char = await fetch(`${fetch_url}character/${quote.character}`, { headers: { 'Authorization': `Bearer ${process.env.LOTR_TOKEN}` } }).then(resp => resp.json()).catch(e => {
                        console.log(e);
                        return message.reply('Désolé je ne trouve plus mon anneau...')
                    })

                    let quoteEmbed = new Discord.MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle('Devine le film de la Trilogie')
                        .setDescription('*Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk, agh burzum-ishi krimpatul*')
                        .addField(`À quel moment \`${char.docs[0].name}\` a dit`, `\`${quote.dialog.trim()}\``)
                        .addField('Choix', '💍: La Communauté de l\'Anneau\n🗼: Les Deux Tours\n👑: Le Retour du Roi')
                        .setThumbnail('https://static.wikia.nocookie.net/lotr/images/8/8b/DOiAi2WUEAE3A1Y.0.jpg/revision/latest?cb=20200305221819')
                        .setFooter('La seule chose que l\'on puisse décider est quoi faire du temps qui nous est imparti.', message.client.user.displayAvatarURL())
                        .setTimestamp()

                    let sentEmbed;
                    message.channel.send(quoteEmbed).then(bot_msg => {
                        sentEmbed = bot_msg;
                        sentEmbed.react('💍').catch(e => {
                            console.log(e);
                            return message.reply('Désolé je ne trouve plus mon anneau...')
                        })
                            .then(() => sentEmbed.react('🗼')).catch(e => {
                                console.log(e);
                                return message.reply('Désolé je ne trouve plus mon anneau...')
                            })
                            .then(() => { sentEmbed.react('👑'); return sentEmbed }).catch(e => {
                                console.log(e);
                                return message.reply('Désolé je ne trouve plus mon anneau...')
                            })
                            .then(msg => {
                                msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '💍' || reaction.emoji.name == '🗼' || reaction.emoji.name == '👑'), { max: 1, time: 600000, errors: ['time'] })
                                    .then(async collected => {
                                        let choice_str;
                                        let result;
                                        if (collected.first().emoji.name == '💍') {
                                            choice_str = `${message.author.username} a choisi d'attribuer cette citation à \`La Communauté de l'Anneau\`.`
                                            if (movie.docs[0]._id == '5cd95395de30eff6ebccde5c') {
                                                choice_str += `\n**Et c'est correct, c'est incroyable !**`
                                                result = 1;
                                            } else {
                                                choice_str += `\n**Et malheureusement c'est totalment faux**, c'était évident pourtant : \`${movies.get(movie.docs[0]._id)}\``
                                                result = 0;
                                            }
                                        } else if (collected.first().emoji.name == '🗼') {
                                            choice_str = `${message.author.username} a choisi d'attribuer cette citation aux \`Deux Tours\`.`
                                            if (movie.docs[0]._id == '5cd95395de30eff6ebccde5b') {
                                                choice_str += `\n**Et c'est correct, c'est incroyable !**`
                                                result = 1;
                                            } else {
                                                choice_str += `\n**Et malheureusement c'est totalment faux**, c'était évident pourtant : \`${movies.get(movie.docs[0]._id)}\``
                                                result = 0;
                                            }
                                        } else {
                                            choice_str = `${message.author.username} a choisi d'attribuer cette citation au \`Retour du Roi\`.`
                                            if (movie.docs[0]._id == '5cd95395de30eff6ebccde5d') {
                                                choice_str += `\n**Et c'est correct, c'est incroyable !**`
                                                result = 1;
                                            } else {
                                                choice_str += `\n**Et malheureusement c'est totalment faux**, c'était évident pourtant : \`${movies.get(movie.docs[0]._id)}\``
                                                result = 0;
                                            }
                                        }
                                        quoteEmbed = msg.embeds[0].spliceFields(1, 1)
                                        quoteEmbed.addField('Choix', choice_str)
                                        msg.edit(quoteEmbed);
                                        await LotrScores.addLotrScore(message.author.id, message.guild.id, result);

                                    }).catch(e => {
                                        // console.log(e);
                                        // return message.reply('Terrible tu n\'as pas voulu me répondre sur Le Seigneur des Anneaux')
                                    })
                            }).catch(e => {
                                console.log(e);
                                return message.reply('Désolé je ne trouve plus mon anneau...')
                            })
                    }).catch(e => {
                        console.log(e);
                        return message.reply('Désolé je ne trouve plus mon anneau...')
                    })
                }).catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon anneau...')
                })
        }
    }

}