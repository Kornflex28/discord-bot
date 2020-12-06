require('dotenv').config();
const Discord = require('discord.js');
const fetch = require("node-fetch");
var fetch_url;

module.exports = {
	name: 'math',
    description: 'Infos très utile sur un nombre',
    cooldown: 5,
    usage: '<nombre> ou rien',
	execute(message, args) {
        var n = parseInt(args[0]);
        if (!args.length) {
            fetch_url = 'http://numbersapi.com/random/trivia?json'
        } 
        else if (isNaN(n)) {
            return message.reply('ton premier argument n\'est pas un nombre. (Bohr, 1910)');    
        } else {
            fetch_url = `http://numbersapi.com/${n}/trivia?json`
        }
        fetch(fetch_url).then(response=>response.json())
        .then(json=> {
            // console.log(json);
            message.channel.send(`> ${json.text}`)
        })
    }
}
