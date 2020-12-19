const answers = [
    'Pas d\'avis',
    'C\'est ton destin',
    'Le sort en est jeté',
    'Une chance sur deux',
    'D\'après moi oui',
    'C\'est certain',
    'Oui absolument',
    'Tu peux compter dessus',
    'Sans aucun doute',
    'Très probable',
    'Oui',
    'C\'est bien parti',
    'C\'est non',
    'Peu probable',
    'Faut pas rêver',
    'N\'y compte pas',
    'Impossible'
];
const Discord = require('discord.js');
module.exports = {
	name: '8ball',
    description: 'La boule magique !!',
    cooldown: 2,
    aliases: ['boule','boulemagique'],
    args:true,
	execute(message, args) {
        if (!args.length){
           return message.reply('dis moi quelque chose au moins ! 🧙');
        } else {
            message.channel.send(`*${answers[Math.floor(Math.random()*answers.length)]}* 🔮`);
        }
	},
};