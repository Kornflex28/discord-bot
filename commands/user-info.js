const Discord = require('discord.js');
module.exports = {
	name: 'user-info',
	description: 'User infos',
	execute(message, args) {
        console.log(message.author);
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${message.author.username}`)
            // .setURL(`${message.author.dmChannel}`)
            .setDescription(`Crée le: ${message.author.createdAt.toISOString().split('T')[0]}\n${message.author.presence.status}`)
            .setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}`)
            .setTimestamp()

        message.channel.send(exampleEmbed);
	},
};
