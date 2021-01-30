require('dotenv').config();



function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

module.exports = {
  name: 'order66',
  description: 'Exécute l\'Ordre 66. Enfin... il y a une chance sur 2 pour que ça marche',
  aliases: ['ordre66', '66'],
  guildOnly: true,
  cooldown: 24*3600,
  execute(message, args) {
    if (Math.random()<=0.5) {
      return message.reply(`Aie pas de chance, il y avait 50% chance d\'échec... Il te faudra attendre \`${this.cooldown} s\` avant de réessayer`)
    }
    const client = message.client;
    const messageChannel = message.channel;
    const commands = client.commands.filter(c => !c.args && c.name != this.name)
    const commandsName = commands.map(c => c.name)
    // console.log(commandsName)
    shuffle(commandsName)
    const serverChannels = message.guild.channels.cache.filter(ch => (ch.type == 'text' && ch.name != '🌾xp-farm' && ch.name != '🥋macron-vs-sardoche'));
    serverChannelsId = serverChannels.map(ch => ch.id)
    // console.log(serverChannelsId)
    messageChannel.send("https://tenor.com/N55Q.gif")
      .then(() => messageChannel.send("*L'ordre 66 sera exécuté dans quelques instants...*"))
      .catch(e => {
        console.log(e);
        return message.reply('Désolé mais l\'ordre est annulé...')
      })
      .then(() => {
        setTimeout(() => {
          commandsName.forEach(c => {
            let command = commands.get(c);
            let channel = serverChannels.get(serverChannelsId[Math.floor(Math.random() * serverChannelsId.length)]);
            message.channel = channel;
            console.log(`execute ${command.name} in ${message.channel.name}`)
            try { command.execute(message, []) } catch (error) { console.log(command.name) }
          })
        }, 5000)
      }).catch(e => {
        console.log(e);
        return message.reply('Désolé mais l\'ordre est annulé...')
      })
  }
}