require('dotenv').config();
const Discord = require('discord.js');
const fetch = require("node-fetch");
let fetch_url;

module.exports = {
    name: 'apod',
    description: 'Astrophoto du jour (APOD), preciser "ajd" pour avoir celle d\'aujourd\'hui, sinon elle sera aléatoire (hmm j\'adore l\'aléa)',
    cooldown: 15,
    usage: '<ajd>',
    execute(message, args) {
        if (!args.length) {
            let randYear = Math.floor(Math.random() * 21) + 2000;
            let randMonth = Math.floor(Math.random() * 12) + 1;
            let randDay = Math.floor(Math.random() * 29) + 1;
            fetch_url = "https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_TOKEN + `&date=${randYear}-${randMonth}-${randDay}`
        } else if (args[0] === 'ajd') {
            fetch_url = "https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_TOKEN;
        } else {
            return message.reply(`désolé mais l'argument \`${args[0]}\` n'est pas correct, essaye avec "ajd".`)
        }
        fetch(fetch_url).then(response => response.json())
            .then(json => {
                // console.log(json)
                let apodEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(json.title)
                    .setDescription(json.explanation)
                    .setImage(json.hdurl)
                    .setTimestamp()
                    .setFooter(`Entrée du ${json.date}`)

                message.channel.send(apodEmbed);
            }).catch(e => {
                console.log(e);
                return message.reply('Oh non j\'ai perdu mes dés dans l\'espace, je vais mettre un moment avant des les retrouver...')
            })

    }
}
