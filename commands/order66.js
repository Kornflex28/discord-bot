require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const frNouns = './french_nouns.txt';

excl_commands=['order66','8ball','hangman','guess','help','reload','definition'];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

module.exports = {
	name: 'order66',
    description: 'Exécute l\'Ordre 66.',
	aliases: ['ordre66','66'],
	cooldown: 60,
	execute(message, args) {
        const client = message.client;
        const messageChannel = message.channel;
        const commands = client.commands.filter(c => !(excl_commands.includes(c.name)))
        const commandsName = commands.map(c=>c.name)
        shuffle(commandsName)
        const serverChannels = message.guild.channels.cache.filter(ch=>(ch.type == 'text' && ch.name !='🌾xp-farm'));
        serverChannelsId = serverChannels.map(ch=>ch.id)
        console.log(serverChannelsId)
        commandsName.forEach(c => {
            var command = commands.get(c);
            var channel = serverChannels.get(serverChannelsId[Math.floor(Math.random()*serverChannelsId.length)]);
            message.channel = channel;
            console.log(`execute ${command.name} in ${message.channel.name}`)
            try {command.execute(message,[])} catch (error) {}
        })
    }
}