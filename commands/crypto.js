const Discord = require('discord.js')
const fetch = require('node-fetch');
const fetch_url = 'http://api.shruc.ml/saladlog/price'


function cryptoEmbed(coin, value, change24, message) {
    return new Discord.MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setTitle(`💰 Valeur du ${coin} 💰`)
        .setDescription('Personne d\'autre que vous n\'est responsable de vos pertes ou même de vos gains.')
        .addField('Valeur en $USD', `\`$ ${value.toLocaleString('fr-FR')}\``, true)
        .addField('Varation (par rapport à il y a 24 h)', `\`$ ${change24 >= 0 ? '+' + Math.abs(change24).toLocaleString('fr-FR') : `-${(-change24).toLocaleString('fr-FR')}`}\``, true)
        .setTimestamp()
        .setFooter('Faites attention à la dépendance !', message.client.user.displayAvatarURL());
}

function checkStatus(res, message, args) {
    checkStatusVar = 1;
    if (res.status == 400) {
        return message.channel.send(`Es tu sur.e que \`${args[0].toUpperCase()}\` est une cryptomonnaie valide ?`);
    } else if (res.status == 502) {
        return message.channel.send(`Le serveur à l'air à plat, mieux vaut retenter plus tard.`);
    } else if (res.status == 429) {
        return message.channel.send(`Oh non, on m'a limité l'accès à l'API.`);
    } else {
        return message.channel.send(`Quelque chose a craqué ...`);
    }
}


module.exports = {
    name: 'crypto',
    description: 'Lance les dés pour obtenir les prix des cryptos',
    cooldown: 3,
    aliases: ['prix'],
    args: true,
    usage: '<coin> (les 3 lettres)',
    execute(message, args) {
        let checkStatusVar;
        message.channel.send(`Une petite minute je regarde mes chiffres ... 🤑`)
        fetch(`${fetch_url}?coin=${args[0].toLowerCase()}`)
            .then(res => {
                if (!res.ok) {
                    checkStatus(res, message, args);
                }
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                } else {
                    return undefined
                }
            }).catch(e => {
                console.log(e)
                return message.reply('Aie j\'ai perdu tous mes coins... Une minute')
            })
            .then(json => {
                if (json) {
                    try {
                        message.channel.send(cryptoEmbed(json.RAW.FROMSYMBOL, json.RAW.PRICE, json.RAW.CHANGE24HOUR.toFixed(6), message));
                    } catch (error) {
                        console.log(error.message);
                        if (!checkStatusVar == 1) message.channel.send(`Des choses amusantes se sont produites lors de la tentative d'affichage des données. Réessaye plus tard. \nErreur: \`${error.message}\``);
                        return;
                    }
                } else {
                    return;
                }
            }).catch(e => {
                console.log(e)
                return message.reply('Aie j\'ai perdu tous mes coins... Une minute')
            });

    },
};