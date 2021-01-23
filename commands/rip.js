const fs = require('fs');
const locales = JSON.parse(fs.readFileSync('./locales/fr-FR.json').toString());

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

module.exports = {
    name: 'rip',
    description: 'Dédé envoie ses respects!',
    cooldown: 1,
    aliases: ['f', 'dead'],
    execute(message, args) {
        message.channel.send(locales.rip.random()).then(msg => msg.react('🇫'));
    },
};