const { getLyrics } = require('genius-lyrics-api');
require('dotenv').config();

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const genius = require("genius-lyrics");
const geniusClient = new genius.Client(process.env.GENIUS_ACCESS_TOKEN);
const artistId = 45855;


module.exports = {
    name: 'damso',
    description: 'Damso Dems',
    aliases: ['dems', 'dams'],
    cooldown: 5,
    async execute(message, args) {
        message.channel.send("ahem... un instant")
        try {
            const artist = await geniusClient.artists.get(artistId);
            const songs = await artist.songs();
            const song = songs.random()
            
            getLyrics({ apiKey: process.env.GENIUS_ACCESS_TOKEN, title: song.title, artist: 'Damso', optimizeQuery: true })
            .then((lyrics) => {
                return message.channel.send(`> ${lyrics.split(/\n+/).filter(s => !s.includes('[')).random()}`)
            })
            .catch(e => {
                console.log(e)
                return message.channel.send("Aie ! Erreur dans ma connexion, batterie faible veuillez la recharger")
            })

        } catch (e) {
            console.log(e)
            return message.channel.send("Aie ! Erreur dans ma connexion, batterie faible veuillez la recharger")
        }

        
    }
}