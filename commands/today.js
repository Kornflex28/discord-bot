require('dotenv').config();
const Discord = require('discord.js');
const fetch = require("node-fetch");
const translate = require('@vitalets/google-translate-api');
const fetch_url ='http://history.muffinlabs.com/date';
module.exports = {
    name: 'today',
    description: 'Dédé lance les dés et trouve un fait historique dont c\'est l\'anniversaire aujourd\'hui',
    cooldown: 2,
    aliases: ['ajd','history'],
    execute(message,args) {
        message.channel.send('Un moment je parcours la ligne du Temps...')
        fetch(fetch_url).then(resp=>resp.json())
        .then(async json=>{
            // console.log(json)
            const source = json.data['Events']
            const event = source[Math.round(Math.random() * (source.length - 1))]
            const date = await translate(`${json.date}, ${event.year}`,{client: 'gtx',from:'en',to:'fr'});
            const ev = await translate(`${event.text}`,{client: 'gtx',from:'en',to:'fr'});
            const embed = new Discord.MessageEmbed()
            .setTitle(`Evenement historique du ${date.text}`)
            .setColor('RANDOM')
            .setDescription(ev.text)
            .addField('❯\u2000\Plus d\'infos:', `${event.links.map(l => `[${l.title}](${l.link})`).join(', ')}`)
            .setTimestamp()
            .setFooter('Données fournies grâce à la face de visualisation de la ligne du Temps de l\'humain sur Terre',message.client.user.displayAvatarURL())
            message.channel.send(embed);
        })
        // const data = JSON.parse(res.body)
        // 
        // 

        // const embed = new Discord.MessageEmbed()
        //     .setAuthor(`Historical Event from ${data.date}, ${event.year}`)
        //     .setColor('RANDOM')
        //     .setDescription(event.text)
        //     .addField('❯\u2000\Information', `•\u2000\**Year:** ${event.year}\n\•\u2000\**External Link${event.links.length !== 1 ? 's' : ''}:** ${event.links.map(l => `[${l.title}](${l.link})`).join(', ')}`)
        // message.channel.send({ embed });
        }
    }
