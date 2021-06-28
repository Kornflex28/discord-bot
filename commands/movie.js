const fetch = require("node-fetch");
const fetch_url = 'https://www.playphrase.me/api/v1/phrases/search?q=';
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

module.exports = {
    name: 'movie',
    description: 'Ecris une réplique et j\'essaye de trouver un film qui contient cette réplique !',
    aliases: ['film'],
    cooldown: 5,
    args: true,
    usage:'<réplique>',
    async execute(message, args) {
        let search_term = args.join(" ");
        fetch(`${fetch_url}${search_term}`, { method: 'GET', headers: { 'X-Csrf-Token': 'cmf6ALYjeK3Xxi1Wobc1dIitdPqz+IjROylUqKHePZ+HQCkfROzIedaKmgSWlbgJogBBpd5HpkcmvFLF' } }).then(response => response.json())
            .then((data) => {
                // console.log(data)
                let movies = data.phrases;
                if (!movies.length) {
                    return message.channel.send('Désolé... je n\'ai pas trouvé cette réplique dans ma collection de dés !')
                } else {
                    let movie = movies.random();
                    return message.channel.send(`**${movie['video-info'].info}**\n*${movie.text}*`, { files: [movie['video-url']] })
                }
            })
    }
}