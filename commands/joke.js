const { joke_api_key } = require('../../config.json');
const fetch = require("node-fetch");


function replyToJoke(message,joke_type) {
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
        if (!args.length){
            fetch('https://www.blagues-api.fr/api/random?disallow=blondes', {
                headers: {
                    'Authorization': `Bearer ${joke_api_key}`
                }
            })
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                message.channel.send(`**${data.joke}**\n*${data.answer}*`)
                return data;
            })
            .then(data => { 
                replyToJoke(message,data.type);
                if (Math.random()<=replyProb) {
                    message.channel.send('Au risque de me répéter, personnellement, je ne trouve pas ces blagues drôles ni bien écrites, elles viennent de ce que vous appelez Internet...');
                }
            })
        }
        else if (joke_types.includes(joke_type)) {
            fetch(`https://www.blagues-api.fr/api/type/${joke_type}/random`, {
                headers: {
                    'Authorization': `Bearer ${joke_api_key}`
                }
            })
            .then(response => response.json())
            .then(data => {
                message.channel.send(`**${data.joke}**\n*${data.answer}*`)
            })
            .then(() => { 
                replyToJoke(message,joke_type);
                if (Math.random()<=replyProb) {
                    message.channel.send('Au risque de me répéter, personnellement, je ne trouve pas ces blagues drôles ni bien écrites, elles viennent de ce que vous appelez Internet...');
                }
            })
        } else {
            return message.reply(`désolé mais je ne connais pas ce type de blague, voilà les types que j'ai en stock : *${joke_types.join(", ")}*`);
        }
        
        
	},
};
