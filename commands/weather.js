const weather = require('weather-js')
const Discord = require('discord.js');
const moment = require('moment')
require('dotenv').config();
let conditionEMojis = new Map([['0', '⛈️'], ['1', '⛈️'], ['2', '⛈️'], ['3', '⛈️'], ['4', '⛈️'], ['5', '🌨️'], ['6', '❄️'], ['7', '🌨️'], ['8', '🧊'], ['9', '🧊'], ['10', '🌨️'], ['11', '🌧️'], ['12', '🌧️'], ['13', '🌨️'], ['14', '🌨️'], ['15', '🌨️'], ['16', '🌨️'], ['17', '⛈️'], ['18', '🌧️'], ['19', '💨'], ['20', '🌫️'], ['21', '🌫️'], ['22', '🌫️'], ['23', '💨'], ['24', '💨'], ['25', '🧊'], ['26', '☁️'], ['27', '☁️'], ['28', '☁️'], ['29', '⛅'], ['30', '⛅'], ['31', '☀️'], ['32', '☀️'], ['33', '🌤️'], ['34', '🌤️'], ['35', '⛈️'], ['36', '☀️'], ['37', '⛈️'], ['38', '⛈️'], ['39', '🌧️'], ['40', '🌧️'], ['41' - '🌨️'], ['42', '🌨️'], ['43', '🌨️'], ['44', ''], ['45', '🌧️'], ['46', '🌨️'], ['47', '⛈️']]);
module.exports = {
    name: 'weather',
    description: 'Prévisions météo du lieu en question pour les 3 prochains jours (normalement).',
    cooldown: 2,
    aliases: ['meteo', 'météo'],
    usage: '<ville>',
    args: true,
    async execute(message, args) {
        try {

            await weather.find({ search: args.join(' '), degreeType: 'C', lang: 'FR' }, async (err, result) => {
                if (err) {
                    return message.channel.send(`Pas de résultat pour cette recherche... Ce lieu existe-t-il vraiment ?? :spy:`);
                }

                if (!result || !result.length) {
                    return message.channel.send(`Pas de résultat pour cette recherche... Ce lieu existe-t-il vraiment ?? :spy:`);
                }

                let fields = [{
                    name: `Aujourd'hui à ${result[0].current.observationtime}`,
                    value: `**Condition:** ${result[0].current.skytext}, ${result[0].current.temperature}\u00B0${result[0].location.degreetype}\n**Ressenti:** ${result[0].current.feelslike}\u00B0${result[0].location.degreetype}\n**Humidité:** ${result[0].current.humidity}%\n**Vent:** ${result[0].current.winddisplay}`
                }];
                // for (let i = 0; i < result[0].forecast.length; i++) {
                for (let i = 2; i < 5; i++) {
                    // console.log(result)
                    fields.push({
                        name: `${moment(result[0].forecast[i].date).format('DD/MM/YYYY')} ${conditionEMojis.get(result[0].forecast[i].skycodeday)}`,
                        value: `**Condition:** ${result[0].forecast[i].skytextday}\n**Min:** ${result[0].forecast[i].low} \u00B0${result[0].location.degreetype}\n**Max:** ${result[0].forecast[i].high} \u00B0${result[0].location.degreetype}`,
                        inline: true
                    });
                }

                let weatherEmbed = new Discord.MessageEmbed()
                    .setTitle(`🌦️ | Prévisions météo de ${message.client.user.username}`)
                    .setDescription(result[0].location.name)
                    .addFields(fields)
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setFooter('Données fournies grâce aux connexions intergalactiques de Dédé sujettes à l\'Aléa', message.client.user.displayAvatarURL())
                await message.channel.send(weatherEmbed);
            });
        } catch (err) {
            return message.reply(`\`${err.message}\``);
        }

    }
}