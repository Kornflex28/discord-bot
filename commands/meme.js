const fetch = require("node-fetch");
const fetch_url = 'https://some-random-api.ml/meme'
module.exports = {
	name: 'meme',
    description: 'Lance les dés et observons ce que l\'Aléa a pour nous',
    cooldown: 5,
	execute(message, args) {
        fetch(fetch_url).then(res=>res.json())
        .then(json => {
            message.channel.send(json.image)
            message.channel.send('🤣 '.repeat(Math.floor(Math.random()*10)))
        })
	},
};