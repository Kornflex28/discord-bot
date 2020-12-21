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
  guildOnly: true,
	cooldown: 60,
	execute(message, args) {
        const client = message.client;
        const messageChannel = message.channel;
        const commands = client.commands.filter(c => !c.args && c.name !=this.name)
        const commandsName = commands.map(c=>c.name)
        // console.log(commandsName)
        shuffle(commandsName)
        const serverChannels = message.guild.channels.cache.filter(ch=>(ch.type == 'text' && ch.name !='🌾xp-farm'));
        serverChannelsId = serverChannels.map(ch=>ch.id)
        // console.log(serverChannelsId)
        messageChannel.send("https://tenor.com/N55Q.gif")
        .then(()=>messageChannel.send("*L'ordre 66 sera exécuté dans quelques instants...*"))
        .then(() => {
          setTimeout(() => { commandsName.forEach(c => {
              var command = commands.get(c);
              var channel = serverChannels.get(serverChannelsId[Math.floor(Math.random()*serverChannelsId.length)]);
              message.channel = channel;
              console.log(`execute ${command.name} in ${message.channel.name}`)
              try {command.execute(message,[])} catch (error) {console.log(command.name)}
          })
        },5000)
      }
        )
    }
}