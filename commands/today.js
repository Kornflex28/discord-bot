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
        // console.log(moment().format("MM/DD"))
        fetch(`${fetch_url}/${moment().format("MM/DD")}`).then(resp => resp.json())
            .catch(error => {
                console.log(error);
                return message.channel.send('Oups la ligne s\'est brisée, pas d\'inquiétude je m\'en occupe !');
            })
            .then(async json => {
                const source = json.data['Events']
                const births = json.data['Births']
                const birth = births[Math.round(Math.random() * (births.length - 1))]
                const br = await translate(`${birth.text}`, { client: 'gtx', from: 'en', to: 'fr' });
                // console.log(br)
                if (!source.length) {
                    message.channel.send(`Désolé mais je n'ai rien d'enregistré de marquant pour le ${moment(message.createdAt).format('Do MMMM')}...`)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Evenement historique du ${moment(message.createdAt).format('Do MMMM')}`)
                        .setColor(message.guild.me.displayHexColor)
                        .setDescription(`A toi de marquer l'histoire aujourd'hui !`)
                        .addField('Naissance', `**${birth.year}:** ${br.text.includes('[') ? br.text.substring(0, br.text.indexOf('[')) : br.text}`)
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
                        .setColor(message.guild.me.displayHexColor)
                        .setDescription(`**${event.year}:** ${ev.text}`)
                        .addField('Naissance', `**${birth.year}:** ${br.text.includes('[') ? br.text.substring(0, br.text.indexOf('[')) : br.text}`)
                        .addField('❯\u2000\Plus d\'infos:', `${event.links.map(l => `[${l.title}](${l.link})`).join(', ')}, ${birth.links.map(l => `[${l.title}](${l.link})`).join(', ')}`)
                        .setTimestamp()
                        .setFooter('Données fournies grâce à la face de visualisation de la ligne du Temps de l\'humain sur Terre', message.client.user.displayAvatarURL())
                    return message.channel.send(embed);
                }
            }).catch(error => {
                console.log(error);
                return message.channel.send('Oups la ligne s\'est brisée, pas d\'inquiétude je m\'en occupe !');
            })
    }
}
