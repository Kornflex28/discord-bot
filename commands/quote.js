require('dotenv').config();
const Discord = require('discord.js');
const wiki = require('wikijs').default;
const translate = require('@vitalets/google-translate-api');
const fetch = require("node-fetch");
const fetch_url = 'https://api.quotable.io/random';

module.exports = {
    name: 'quote',
    description: 'Dédé lance les dés et trouve une citation',
    aliases: ['citation', 'cite'],
    cooldown: 3,
    async execute(message, args) {
        message.channel.send('Un instant, laisse moi consulter mes dés ...')
        fetch(fetch_url).then(response => response.json())
            .catch(error => {
                console.log(error);
                return message.channel.send('Aie j\'ai fait tomber tous mes dés. Attends un peu.');
            })
            .then(async json => {

                let quoteEmbed;
                const quote = await translate(json.content, { client: 'gtx', from: 'en', to: 'fr' })
                const wikiSearch = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).search(json.author);
                const wikiPage = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).page(wikiSearch.results[0]);
                if (wikiSearch.results) {
                    const wikiSummary = await wikiPage.summary();
                    const wikiImage = await wikiPage.mainImage();
                    quoteEmbed = new Discord.MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(json.content)
                        .setURL(wikiPage.raw.fullurl)
                        .setDescription(`*__Traduction:__ ${quote.text}*`)
                        .setAuthor(json.author)
                        .setThumbnail(wikiImage)
                        .setFooter('Données récupérées grâce à l\'érudition de Dédé', message.client.user.displayAvatarURL())
                        .setTimestamp();

                    if (wikiSummary.length > 1024) {
                        let sumText = wikiSummary.toString().split('\n')
                        quoteEmbed.addField('*Plus d\'infos*', sumText[0])
                    } else {
                        quoteEmbed.addField('*Plus d\'infos*', wikiSummary.toString())
                    }
                } else {
                    quoteEmbed = new Discord.MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(json.content)
                        .setDescription(`*__Traduction:__ ${quote.text}*`)
                        .setAuthor(json.author)
                        .setFooter('Données récupérées grâce à l\'érudition de Dédé', message.client.user.displayAvatarURL())
                        .setTimestamp();
                }

                return message.channel.send(quoteEmbed)
            }).catch(error => {
                console.log(error);
                return message.channel.send('Aie j\'ai fait tomber tous mes dés. Attends un peu.');
            })

    },
};