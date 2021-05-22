require('dotenv').config();
const fetch = require("node-fetch");
const fetch_url = 'https://api.windy.com/api/webcams/v2/';


module.exports = {
    name: 'world',
    description: 'Je lance mon dé mappemonde et montre le paysage actuel du résultat',
    aliases: ['monde'],
    cooldown:5,
    async execute(message, args) {
        message.channel.send('Laisse moi retrouver mon dé mappemonde un instant...')
        fetch(`${fetch_url}list/orderby=random/limit=1?show=webcams:image,location`, { headers: { 'x-windy-key': `${process.env.WEBCAM_TOKEN}` } }).then(resp => resp.json())
        .then(data =>{
            let webcam = data.result.webcams[0];
            let ts = new Date(webcam.image.update*1000)
            message.channel.send(`${webcam.image.current.preview}`)
            message.channel.send(`${webcam.location.city}, ${webcam.location.region}, ${webcam.location.country}\nLe ${ts.toLocaleString('fr-FR', { timeZone: webcam.location.timezone })} (heure locale)\n${webcam.location.wikipedia?`<${webcam.location.wikipedia.replace(/ /g,'_')}>`:''}`)
        }).catch(e=>{
            return message.channel.send('Ahem... je crois bien m\'être perdu, désolé')
        })
    }
}