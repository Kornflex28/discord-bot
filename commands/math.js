require('dotenv').config();
const fetch = require("node-fetch");
let fetch_url;

module.exports = {
    name: 'math',
    description: 'Infos très utile sur un nombre',
    cooldown: 5,
    usage: '<nombre> ou rien',
    execute(message, args) {
        let n = parseInt(args[0]);
        if (!args.length) {
            fetch_url = 'http://numbersapi.com/random/trivia?json'
        }
        else if (isNaN(n)) {
            return message.reply('ton premier argument n\'est pas un nombre. (Bohr, 1910)');
        } else {
            fetch_url = `http://numbersapi.com/${n}/math?json`
        }
        fetch(fetch_url).then(response => response.json())
            .catch(e => {
                console.log(e);
                return message.reply('Désolé je ne trouve plus mes regles de calcul...')
            })
            .then(json => {
                // console.log(json);
                message.channel.send(`> ${json.text}`)
            }).catch(e => {
                console.log(e);
                return message.reply('Désolé je ne trouve plus mes regles de calcul...')
            })
    }
}
