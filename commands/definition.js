require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
const dict_url = "https://api.dicolink.com/v1/mot/";

module.exports = {
    name: 'definition',
    description: 'Regarde dans mes faces la définition d\'un mot',
    aliases: ['def'],
    args: true,
    usage: '<mot>',
    execute(message, args) {
        const senderChannel = message.channel;
        let word = args[0]
        if (!args.length) {
            return message.reply('il me faut un MOT stp')
        }
        else {
            fetch(dict_url + `${word}/definitions?limite=3&source=larousse&api_key=` + process.env.DICO_TOKEN)
                .then(response => { return response.json() })
                .catch(e => {
                    console.log(e);
                    return message.reply('désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux')
                })
                .then(json => {
                    if (json.error) { return senderChannel.send('Désolé mais je n\'ai rien trouvé pour ce mot...') }
                    let def_str = new Discord.MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setFooter('Le mot juste aiguise la pensée',message.client.user.displayAvatarURL())
                        .setTitle(word)
                        .setTimestamp()
                        .setDescription('[Larousse](https://www.larousse.fr/)')
                    json.forEach(elem => {

                        def_str.addField(elem.nature, elem.definition);
                    });
                    senderChannel.send(`Voilà ce que j'ai trouvé pour ce mot:`).then(() => senderChannel.send(def_str))
                })
                .catch(e => {
                    console.log(e);
                    return message.reply('désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux')
                });
        }
    },
};