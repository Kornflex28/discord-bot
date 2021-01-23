const fetch = require("node-fetch");
const fetch_url = 'https://meme-api.herokuapp.com/gimme'
module.exports = {
    name: 'meme',
    description: 'Lance les dés et observons ce que l\'Aléa a pour nous',
    cooldown: 5,
    execute(message, args) {
        fetch(fetch_url).then(res => res.json())
            .catch(e => {
                console.log(e);
                return message.reply('Désolé je ne trouve plus mes memes...')
            })
            .then(json => {
                try {
                    if (!json.nsfw) {
                        message.channel.send(`J'ai trouvé ça sur \`/r/${json.subreddit}\` ` + '🤣 '.repeat(Math.floor(Math.random() * 10)))
                        message.channel.send(json.url)
                    }
                    else {
                        message.channel.send('J\'en ai trouvé un mais bon... c\'est pas tout public alors je te conseille de relancer plutôt ahem...')
                    }

                } catch { }
            }).catch(e => {
                console.log(e);
                return message.reply('Désolé je ne trouve plus mes memes...')
            })
    },
};