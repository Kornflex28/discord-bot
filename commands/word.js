require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
const dict_url = "https://api.dicolink.com/v1/mots/motauhasard?avecdef=true&minlong=5&maxlong=-1&verbeconjugue=false&api_key=";

module.exports = {
    name: 'word',
    description: 'Lance les dés et obtiens un mot français aléatoire et sa définition',
    aliases: ['mot'],
    execute(message, args) {
        const messageChannel = message.channel;
        messageChannel.send('J\'ouvre mon dictionnaire...')
        fetch(dict_url + process.env.DICO_TOKEN).then(response => response.json())
            .then(json => {
                return json[0].mot
            }).catch(e => {
                console.log(e)
                return message.reply('désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux')
            })
            .then(word => {
                fetch("https://api.dicolink.com/v1/mot/" + `${word}/definitions?limite=3&source=larousse&api_key=` + process.env.DICO_TOKEN).then(response => response.json())
                    .then(json => {
                        if (json.error) { return message.reply('désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux') }

                        let def_str = new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayHexColor)
                            .setFooter('Le mot juste aiguise la pensée',message.client.user.displayAvatarURL())
                            .setTitle(word)
                            .setDescription('[Larousse](https://www.larousse.fr/)')
                        json.forEach(elem => {
                            if (elem.nature && elem.definition) {
                                def_str.addField(elem.nature, elem.definition);
                            }
                        });
                        messageChannel.send(def_str);
                    }).catch(e => {
                        console.log(e)
                        return message.reply('désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux')
                    })
            }).catch(e => {
                console.log(e)
                return message.reply('désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux')
            })
    },
};