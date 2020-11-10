const { tenor } = require('../config.json');
const fetch = require("node-fetch");
const randomWords = require('random-words');
module.exports = {
	name: 'gif',
    description: 'Lance le dé et envoie un gif selon une recherche ou un gif aleatoire si aucun argument n\'est donné',
    cooldown: 15,
    usage: '<recherche>',
	execute(message, args) {
        if (!args.length){
            var search_url = "https://api.tenor.com/v1/random?q=" + randomWords() + "&key=" + tenor.api_key + "&limit=" + tenor.search_limit + "&media_filter=minimal&contentfilter=medium";
            
            fetch(search_url)
                .then(response => response.json())
                .then(json => {
                    // console.log(json);
                    message.channel.send(json.results[Math.floor(Math.random() * tenor.search_limit)].url);
                })
        }
        else if (args.length>0) {
            const search_term = args.join(" ");
            console.log(search_term)
            var search_url = "https://api.tenor.com/v1/random?q=" + search_term + "&key=" + tenor.api_key + "&limit=" + tenor.search_limit + "&media_filter=minimal&contentfilter=medium";
            fetch(search_url)
                .then(response => response.json())
                .then(json => {
                    // console.log(json);
                    message.channel.send(json.results[Math.floor(Math.random() * tenor.search_limit)].url);
                })
        }
	},
};
