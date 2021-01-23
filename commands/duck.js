const fetch = require("node-fetch");
const fetch_url = 'https://random-d.uk/api/v2/random'
module.exports = {
    name: 'duck',
    description: 'Lance le dé et envoie une image de canard',
    aliases: ['canard'],
    cooldown: 3,
    execute(message, args) {
        fetch(fetch_url).then(res => res.json())
            .catch(e => {
                console.log(e);
                return message.reply('désolé mais il y a eu un QWACK')
            })
            .then(json => {
                if (json.url) {
                    message.channel.send(json.url)
                } else {
                    message.channel.send('Désolé mais il y a eu un qwack ...')
                }
            }).catch(e => {
                console.log(e);
                return message.reply('désolé mais il y a eu un QWACK')
            })
    }
}