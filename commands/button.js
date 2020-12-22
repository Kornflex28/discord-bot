require('dotenv').config();
const Discord = require('discord.js');
const fetch = require("node-fetch");
const fetch_url ='https://api2.willyoupressthebutton.com/api/v2/dilemma/';

module.exports = {
	name: 'button',
    description: 'Vas-tu appuyer sur le bouton ?',
    aliases:['bouton','press'],
    cooldown: 3,
	async execute(message, args) {
        let dilemma;
        fetch(fetch_url,{method: 'post'}).then(response => response.json())
        .then(json => {
            if (json.success) {
                dilemma = json.dilemma;
                let buttonEmbed = new Discord.MessageEmbed()
                .setTitle('Appuierez vous sur le bouton ?')
                .setDescription(
                    `**\`${dilemma.txt1[0].toUpperCase() + dilemma.txt1.substring(1).replace(/&#039;/g,'\'')}\`**\nbut\n**\`${dilemma.txt2[0].toUpperCase() + dilemma.txt2.substring(1).replace(/&#039;/g,'\'')}\`**`
                    )
                .setThumbnail('https://i.kym-cdn.com/entries/icons/original/000/019/571/dailystruggg.jpg')
                .addField('Faites un choix, il n\'y a pas d\'autre solution...',`${message.author.username} seulement a le choix de son destin.`)
                .addField('** **','*✅ Appuyer   ❌ Ne pas appuyer*')
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter('Selon l\'Organisation mondiale de la Santé l\'addiction aux jeux vidéo est reconnue comme une maladie au même titre que l\'addiction aux drogues et au tabac.', message.client.user.displayAvatarURL());
                message.channel.send(buttonEmbed).then(bot_msg=>{bot_msg.react('✅');bot_msg.react('❌');return bot_msg})
                .then(msg => {
                    msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),{ max: 1, time: 600000, errors: ['time'] })
                    .then(collected => {
                        let choice_str
                        if (collected.first().emoji.name == '✅') {
                            choice_str = `${message.author.username} a choisi d'appuyer sur le bouton comme ${dilemma.yes.toLocaleString('fr')} autres personnes alors que ${dilemma.no.toLocaleString('fr')} ont refusé.` 
                        } else {
                            choice_str = `${message.author.username} a choisi de ne pas appuyer sur le bouton comme ${dilemma.no.toLocaleString('fr')} autres personnes alors que ${dilemma.yes.toLocaleString('fr')} ont accepté.` 
                        }
                        buttonEmbed = msg.embeds[0].spliceFields(0,2)
                        .setTitle('Appuierez vous sur le bouton ?')
                        .setDescription(
                            `**\`${dilemma.txt1[0].toUpperCase() + dilemma.txt1.substring(1).replace(/&#039;/g,'\'')}\`**\nbut\n**\`${dilemma.txt2[0].toUpperCase() + dilemma.txt2.substring(1).replace(/&#039;/g,'\'')}\`**`
                        )
                        .setThumbnail('https://i.kym-cdn.com/entries/icons/original/000/019/571/dailystruggg.jpg')
                        .addField('Qu\'il en soit ainsi :judge:' , `\`${choice_str}\``)
                        .addField(`Répartition des ${(dilemma.yes+dilemma.no).toLocaleString('fr')} votes`,`${(100*dilemma.yes/(dilemma.yes+dilemma.no)).toFixed(2)} % ✅ vs ${(100*dilemma.no/(dilemma.yes+dilemma.no)).toFixed(2)} % ❌`)
                        .setTimestamp()
                        .setFooter('Selon l\'Organisation mondiale de la Santé l\'addiction aux jeux vidéo est reconnue comme une maladie au même titre que l\'addiction aux drogues et au tabac.', message.client.user.displayAvatarURL());
                        msg.edit(buttonEmbed);    
                    }).catch(() => {});
                })
            } else {
                return message.channel.send('... On dirait que quelque chose s\'est mal passé du coté du site Internet... :plunger:')
            }
        })
        
	},
};