require('dotenv').config();
const Discord = require('discord.js');
const wiki = require('wikijs').default;
const translate = require('@vitalets/google-translate-api');
const fetch = require("node-fetch");
const fetch_url ='https://api.quotable.io/random';

module.exports = {
	name: 'quote',
    description: 'Dédé lance les dés et trouve une citation',
    aliases:['citation','cite'],
    cooldown: 3,
	async execute(message, args) {
        message.channel.send('Un instant, laisse moi consulter mes dés ...')
        fetch(fetch_url).then(response => response.json())
        .then(async json => {

            const quote = await translate(json.content,{client: 'gtx',from:'en',to:'fr'})
            const wikiSearch = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).search(json.author);
            const wikiPage = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).page(wikiSearch.results[0]);
            const wikiSummary = await wikiPage.summary();
            const wikiImage = await wikiPage.mainImage();
            let quoteEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(json.content)
                .setURL(wikiPage.raw.fullurl)
                .setDescription(`*__Traduction:__ ${quote.text}*`)
                .setAuthor(json.author)
                .setThumbnail(wikiImage)
                .setFooter('Données récupérées grâce à l\'érudition de Dédé',message.client.user.displayAvatarURL())
                .setTimestamp();

            if(wikiSummary.length > 1024){
                let sumText = wikiSummary.toString().split('\n')
                quoteEmbed.addField('*Plus d\'infos*',sumText[0])
            } else {
                quoteEmbed.addField('*Plus d\'infos*',wikiSummary.toString())
            }

            return message.channel.send(quoteEmbed)
        })
        
	},
};