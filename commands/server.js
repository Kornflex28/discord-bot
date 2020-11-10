module.exports = {
	name: 'server',
	description: 'Server infos',
	execute(message, args) {
	    message.channel.send(`Nom du serveur: ${message.guild.name}\nNombre de membres: ${message.guild.memberCount}`);
	},
};