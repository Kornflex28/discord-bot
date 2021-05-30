require('dotenv').config();
const wiki = require('wikijs').default;
const Discord = require('discord.js');
const fetch = require("node-fetch");


Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

module.exports = {
    name: 'theorem',
    description: 'Théorème aléatoire',
    cooldown: 10,
    aliases: ['thm','theorem','théorème','théoreme','theorème'],
    async execute(message, args) {
        let thmList=  [];
        let first = await fetch('https://en.wikipedia.org/w/api.php?format=json&action=query&redirects=&prop=links&plnamespace=0&pllimit=500&titles=List%20of%20theorems');
        first = await first.json();
        let cont = first.continue;
        thmList.push(...first.query.pages['587645'].links.map(e=>e.title))
        while (cont){
            more = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&redirects=&prop=links&plnamespace=0&pllimit=500&titles=List%20of%20theorems&plcontinue=${cont.plcontinue}`)
            more = await more.json()
            cont = more.continue;
            thmList.push(...more.query.pages['587645'].links.map(e=>e.title))
        }
        let thm = thmList.random()
        const thmPage = await wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' }).page(thm);
        message.channel.send(`<${decodeURI(thmPage.url())}>`)
    }
}