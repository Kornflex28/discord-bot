const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'uptime',
    description: 'Je consulte mes dés pour savoir depuis quand je suis debout !',
    aliases:['up'],
    cooldown: 3,
	execute(message, args) {

		const d = moment.duration(message.client.uptime);
        const days = d.days();
        const hours = d.hours();
        const minutes = d.minutes();
        const seconds = d.seconds();
        let uptime = `${days > 0 ? `${days} ${days == 1 ? `jour, ` : 'jours, '}` : ``}${hours > 0 ? `${hours} ${hours == 1 ? 'heure, ' : 'heures, '}` : ``}${minutes > 0 ? `${minutes} ${minutes == 1 ? 'minute, ' : 'minutes, '}` : ``}${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`;
        
        if (process.env.HEROKU_RELEASE_VERSION) {
            return message.channel.send(`Je me suis levé il y a ${uptime} et c'est ma version **${process.env.HEROKU_RELEASE_VERSION}** que j'utilise en ce moment ! `);
        } else {
            return message.channel.send(`Je me suis levé il y a ${uptime} et c'est ma version de **développement** que j'utilise en ce moment ! `);
        }
	},
};