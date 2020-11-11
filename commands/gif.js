const { tenor } = require('../config.json');
const fetch = require("node-fetch");
const randomWords = require('random-words');

function clean_str(str) {
    return str.replace('\'',' ')
            .replace('é','e')
            .replace('è','e')
            .replace('ê','e')
            .replace('à','a')
            .replace('')
            ;
};
module.exports = {
	name: 'gif',
    description: 'Lance le dé et envoie un gif selon une recherche ou un gif aleatoire si aucun argument n\'est donné',
    cooldown: 15,
    usage: '<recherche>',
	execute(message, args) {
        var gif_url;
        if (!args.length){
            var search_url = "https://api.tenor.com/v1/search?q=" + randomWords() + "&key=" + tenor.api_key + "&limit=" + tenor.search_limit + "&media_filter=minimal&contentfilter=medium";
            
            fetch(search_url)
                .then(response => response.json())
                .then(json => {
                    try {
                        gif_url = json.results[Math.floor(Math.random() * tenor.search_limit)].url
                        message.channel.send(gif_url);
                    } catch (error) {
                        console.error(error);
                        message.reply(`oups j\'ai du être mal lancé, il y a eu une erreur lors de l\'éxécution.\n\`${error}\``);
                    }
                })
        }
        else if (args.length>0) {
            const search_term = args.join("-")//.replace(/[^a-zA-Z0-9éè]/g,' ');
            console.log(encodeURIComponent(search_term))
            if (search_term.length>30){
                return message.reply(' elle est quand même longue ta recherche, essaye quelquechose de moins long !');
            }
            var search_url = "https://api.tenor.com/v1/search?q=" + encodeURIComponent(search_term) + "&key=" + tenor.api_key + "&limit=" + tenor.search_limit + "&media_filter=minimal&contentfilter=medium";
            // console.log(search_url);
            fetch(search_url)
                .then(response => {return response.json();})
                .then(json => {
                    // console.log(json);
                    if (!json.results.length){
                        message.reply('oh oh... Je n\'ai rien trouvé pour cette recherche, voici un gif aléatoire pour me faire pardonner !');
                        return this.execute(message,[]);
                    } else {
                        try {
                            gif_url = json.results[Math.floor(Math.random() * tenor.search_limit)].url
                            message.channel.send(gif_url);
                        } catch (error) {
                            console.error(error);
                            message.reply(`oups j\'ai du être mal lancé, il y a eu une erreur lors de l\'éxécution.\n\`${error}\``);
                        }
                    } 
                })        
        }
	},
};
