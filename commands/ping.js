const Discord = require('discord.js');
module.exports = {
	name: 'ping',
    description: 'Ping!',
    cooldown: 1,
	execute(message, args) {
		let ping = Date.now() - message.createdTimestamp;
		const pingEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
					.setTitle('🏓 Pong')
					.addFields(
						{name:':timer: Ton ping',value:`${ping} ms`,inline:true},
						{name:':heartbeat: Mon ping',value:`${message.client.ws.ping} ms`,inline:true}
					)
					.setTimestamp()
		message.channel.send(pingEmbed);
	},
};