require('dotenv').config();
const wiki = require('wikijs').default;
const Discord = require('discord.js');
const fetch = require("node-fetch");

async function sendWikiEmbed(message, wikiSearch) {
    if (!wikiSearch.length) {
        return message.reply('désolé mais je n\'ai rien trouvé sur Wikipédia à ce propos !  :judge:')
    }
    let wikiEmbed = new Discord.MessageEmbed()
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/7/75/Wikipedia_mobile_app_logo.png')
        .setColor(message.guild.me.displayHexColor)
        .setTimestamp()
        .setFooter('Données fournies grâce à la face Wikipedia de Dédé. N\'oubliez pas que n\'importe qui peut modifier une page Wikipédia.', message.client.user.displayAvatarURL());
    try {
        const wikiPage = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).page(wikiSearch[0]);
        const wikiSummary = await wikiPage.summary();
        const wikiImage = await wikiPage.mainImage();
        wikiEmbed.setTitle(wikiPage.raw.title);
        wikiEmbed.setURL(wikiPage.raw.fullurl);
        wikiEmbed.setImage(wikiImage);
        if (wikiSummary.length > 2048) {
            let sumText = wikiSummary.toString().split('\n')
            wikiEmbed.setDescription(sumText.slice(0, 2).join('\n'))
            wikiEmbed.addField('[...]', `*Plus d'info [ici](${wikiPage.raw.fullurl})*`)
        } else {
            wikiEmbed.setDescription(wikiSummary.toString())
        }
        return message.channel.send(wikiEmbed);
    } catch (e) { console.log(e) }
}

module.exports = {
    name: 'wikipedia',
    description: 'Lancé les dés et effectue une recherche wikipedia, ou une page aléatoire si aucune recherche n\'est donnée.',
    cooldown: 5,
    aliases: ['wiki'],
    usage: '<recherche> ou rien',
    async execute(message, args) {
        const search = args.join(" ")
        if (!args.length) {
            const wikiSearch = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).random(1);
            message.channel.send('Et c\'est parti pour la roulette russe de Wikipédia')
            try {
                return await sendWikiEmbed(message, wikiSearch);
            } catch (e) {
                return message.channel.send('Aie allons cherche *bug* sur Wikipédia...')
            }
        } else {
            message.channel.send('Laisse moi consulter ma face Wikipédia ...')
            const wikiSearch = await wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' }).search(search);
            try {
                return await sendWikiEmbed(message, wikiSearch.results);
            } catch (e) {
                return message.channel.send('Aie allons cherche *bug* sur Wikipédia...')
            }

        }
    }
}


