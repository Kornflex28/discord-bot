require('dotenv').config();
const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const fetch = require("node-fetch");
const fetch_url ='https://api.adviceslip.com/advice';

module.exports = {
	name: 'advice',
    description: 'Dédé te donne un conseil',
    aliases:['conseil'],
    cooldown: 3,
	async execute(message, args) {
        fetch(fetch_url).then(response => response.json())
        .then(json => {
            if (json) {
                let advice = json.slip.advice
                translate(advice,{client: 'gtx',from:'en',to:'fr'}).then(res=>message.channel.send(`*${res.text}* :bird:`))
            } else {
                return message.channel.send('... On dirait que quelque chose s\'est mal passé du coté du site Internet... :plunger:')
            }
        })
        
	},
};