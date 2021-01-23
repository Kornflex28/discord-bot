const fs = require('fs');
const locales = JSON.parse(fs.readFileSync('./locales/fr-FR.json').toString());
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

module.exports = {
	name: '8ball',
    description: 'La boule magique !!',
    cooldown: 2,
    aliases: ['boule','boulemagique'],
    usage: '<question>',
    args:true,
	execute(message, args) {
            message.channel.send(`🧙 *${locales.ballAnswers.random()}* 🔮`);
	},
};