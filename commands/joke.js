require('dotenv').config()
const fetch = require("node-fetch");


function replyToJoke(message, joke_type) {
    if (joke_type === 'dev') {
        message.channel.send('Hahaha j\'ai compris celle là');
    }
    else if (joke_type === 'beauf') {
        message.channel.send(`AH BAH C'EST BIEN DROLE CA`);
    }
    else if (joke_type === 'dark') {
        message.channel.send(`Ahem... L'humour noir, le plus rare`)
    }
    else if (joke_type === 'limit') {
        message.channel.send(`Limite ça ...`)
    }
}

module.exports = {
    name: 'joke',
    description: 'Lance le dé et envoie une blague d\'un certain type ou une aleatoire si aucun argument n\'est donné',
    cooldown: 4,
    aliases: ['blague'],
    usage: '<type>',
    execute(message, args) {
        const joke_type = args[0];
        const joke_types = ['global', 'dev', 'dark', 'limit', 'beauf'];
        const replyProb = 0.42;
        if (!args.length) {
            fetch('https://www.blagues-api.fr/api/random?disallow=blondes', {
                headers: {
                    'Authorization': `Bearer ${process.env.JOKE_TOKEN}`
                }
            })
                .then(response => response.json())
                .catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon carnet de blague')
                })
                .then(data => {
                    // console.log(data)
                    message.channel.send(`**${data.joke}**\n*${data.answer}*`)
                    return data;
                }).catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon carnet de blague')
                })
                .then(data => {
                    replyToJoke(message, data.type);
                    if (Math.random() <= replyProb) {
                        message.channel.send('Au risque de me répéter, personnellement, je ne trouve pas ces blagues drôles ni bien écrites, elles viennent de ce que vous appelez Internet...');
                    }
                }).catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon carnet de blague')
                })
        }
        else if (joke_types.includes(joke_type)) {
            fetch(`https://www.blagues-api.fr/api/type/${joke_type}/random`, {
                headers: {
                    'Authorization': `Bearer ${process.env.JOKE_TOKEN}`
                }
            })
                .then(response => response.json())
                .catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon carnet de blague')
                })
                .then(data => {
                    message.channel.send(`**${data.joke}**\n*${data.answer}*`)
                }).catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon carnet de blague')
                })
                .then(() => {
                    replyToJoke(message, joke_type);
                    if (Math.random() <= replyProb) {
                        message.channel.send('Au risque de me répéter, personnellement, je ne trouve pas ces blagues drôles ni bien écrites, elles viennent de ce que vous appelez Internet...');
                    }
                }).catch(e => {
                    console.log(e);
                    return message.reply('Désolé je ne trouve plus mon carnet de blague')
                })
        } else {
            return message.reply(`désolé mais je ne connais pas ce type de blague, voilà les types que j'ai en stock : *${joke_types.join(", ")}*`);
        }


    },
};
