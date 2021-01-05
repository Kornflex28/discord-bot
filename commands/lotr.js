const Discord = require('discord.js');
require('dotenv').config();
const fetch = require("node-fetch");
const fetch_url = 'https://the-one-api.dev/v2/';
const movies = new Map([['5cd95395de30eff6ebccde5c','La Communauté de l\'Anneau'],['5cd95395de30eff6ebccde5b','Les Deux Tours'],['5cd95395de30eff6ebccde5d','Le Retour du Roi']]);

module.exports = {
    name: 'lotr',
    description: 'Dédé agite ses dés et trouve une citation de l\'iconique trilogie de J.R.R Tolkien',
    cooldown: 2,
    // aliases: ['ajd', 'history'],
    execute(message, args) {
        if (!args.length || args[0]!='perso') {
            fetch(`${fetch_url}quote?limit=2390`, { headers: { 'Authorization': `Bearer ${process.env.LOTR_TOKEN}` } }).then(resp => resp.json())
                .then(async json => {
                    let quote = json.docs[Math.floor(Math.random()*json.docs.length)]
                    let movie = await fetch(`${fetch_url}movie/${quote.movie}`, { headers: { 'Authorization': `Bearer ${process.env.LOTR_TOKEN}` } }).then(resp=>resp.json())
                    let char = await fetch(`${fetch_url}character/${quote.character}`, { headers: { 'Authorization': `Bearer ${process.env.LOTR_TOKEN}` } }).then(resp=>resp.json())
                    console.log(quote.dialog,movie,char)

                    let quoteEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Devine le film de la Trilogie')
                    .setDescription('*Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk, agh burzum-ishi krimpatul*')
                    .addField(`À quel moment \`${char.docs[0].name}\` a dit`,`\`${quote.dialog}\``)
                    .addField('Choix','💍: La Communauté de l\'Anneau\n🗼: Les Deux Tours\n👑: Le Retour du Roi')
                    .setThumbnail('https://static.wikia.nocookie.net/lotr/images/8/8b/DOiAi2WUEAE3A1Y.0.jpg/revision/latest?cb=20200305221819')
                    .setFooter(`Jeu sponsorisé par ${message.client.users.cache.get(process.env.CREATOR_ID).username}`,message.client.user.displayAvatarURL())
                    .setTimestamp()

                    let sentEmbed;
                    message.channel.send(quoteEmbed).then(bot_msg =>{
                        sentEmbed = bot_msg;
                        sentEmbed.react('💍').then(()=>sentEmbed.react('🗼')).then(()=>{sentEmbed.react('👑');return sentEmbed})
                        .then(msg =>{
                            msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '💍' || reaction.emoji.name == '🗼' || reaction.emoji.name == '👑'),{ max: 1, time: 600000, errors: ['time'] })
                            .then(collected => {
                                let choice_str;
                                if (collected.first().emoji.name == '💍') {
                                    choice_str = `${message.author.username} a choisi d'attribuer cette citation à \`La Communauté de l'Anneau\`.`
                                    if (movie.docs[0]._id == '5cd95395de30eff6ebccde5c') {
                                        choice_str+= `\n**Et c'est correct, c'est incroyable !**`
                                    } else {
                                        choice_str+= `\n**Et malheureusement c'est totalment faux**, c'était évident pourtant : \`${movies.get(movie.docs[0]._id)}\``
                                    }
                                } else if (collected.first().emoji.name == '🗼'){
                                    choice_str = `${message.author.username} a choisi d'attribuer cette citation aux \`Deux Tours\`.`
                                    if (movie.docs[0]._id == '5cd95395de30eff6ebccde5b') {
                                        choice_str+= `\n**Et c'est correct, c'est incroyable !**`
                                    } else {
                                        choice_str+= `\n**Et malheureusement c'est totalment faux**, c'était évident pourtant : \`${movies.get(movie.docs[0]._id)}\``
                                    }
                                } else {
                                    choice_str = `${message.author.username} a choisi d'attribuer cette citation au \`Retour du Roi\`.`
                                    if (movie.docs[0]._id == '5cd95395de30eff6ebccde5d') {
                                        choice_str+= `\n**Et c'est correct, c'est incroyable !**`
                                    } else {
                                        choice_str+= `\n**Et malheureusement c'est totalment faux**, c'était évident pourtant : \`${movies.get(movie.docs[0]._id)}\``
                                    }
                                }
                                quoteEmbed = msg.embeds[0].spliceFields(1,1)
                                quoteEmbed.addField('Choix',choice_str)
                                msg.edit(quoteEmbed);
                            })
                        })
                    })
                })
        }
    }
    
}