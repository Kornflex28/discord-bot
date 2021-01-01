require('dotenv').config();
const Discord = require('discord.js');
let moment = require('moment')
moment.locale('fr');
const fetch = require("node-fetch");
const translate = require('@vitalets/google-translate-api');
const fetch_url = 'http://history.muffinlabs.com/date';
module.exports = {
    name: 'today',
    description: 'Dédé lance les dés et trouve un fait historique dont c\'est l\'anniversaire aujourd\'hui',
    cooldown: 2,
    aliases: ['ajd', 'history'],
    execute(message, args) {
        message.channel.send('Un moment je parcours la ligne du Temps...')
        fetch(fetch_url).then(resp => resp.json())
            .then(async json => {
                const source = json.data['Events']
                const births = json.data['Births']
                const birth = births[Math.round(Math.random() * (births.length - 1))]
                const br = await translate(`${birth.text}`, { client: 'gtx', from: 'en', to: 'fr' });
                if (!source.length) { 
                    message.channel.send(`Désolé mais je n'ai rien d'enregistré de marquant pour le ${moment(message.createdAt).format('Do MMMM')}...`)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Evenement historique du ${moment(message.createdAt).format('Do MMMM')}`)
                        .setColor('RANDOM')
                        .setDescription(`A toi de marquer l'histoire aujourd'hui !`)
                        .addField('Naissance',`${birth.year}: ${br.text.substring( 0, br.text.indexOf('[') )}`)
                        .addField('❯\u2000\Plus d\'infos:', `${birth.links.map(l => `[${l.title}](${l.link})`).join(', ')}`)
                        .setTimestamp()
                        .setFooter('Données fournies grâce à la face de visualisation de la ligne du Temps de l\'humain sur Terre', message.client.user.displayAvatarURL())
                    return message.channel.send(embed)
                } else {
                    const event = source[Math.round(Math.random() * (source.length - 1))]
                    console.log(event)
                    const ev = await translate(`${event.text}`, { client: 'gtx', from: 'en', to: 'fr' });
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Evenement historique du ${moment(message.createdAt).format('Do MMMM')}`)
                        .setColor('RANDOM')
                        .setDescription(ev.text)
                        .addField('Naissance',`${birth.year}: ${br.text.substring( 0, br.text.indexOf('[') )}`)
                        .addField('❯\u2000\Plus d\'infos:', `${event.links.map(l => `[${l.title}](${l.link})`).join(', ')}, ${birth.links.map(l => `[${l.title}](${l.link})`).join(', ')}`)
                        .setTimestamp()
                        .setFooter('Données fournies grâce à la face de visualisation de la ligne du Temps de l\'humain sur Terre', message.client.user.displayAvatarURL())
                    return message.channel.send(embed);
                }
            })
    }
}
