module.exports = {
	name: 'ping',
    description: 'Ping!',
    cooldown: 1,
	execute(message, args) {
		var ping = Date.now() - message.createdTimestamp + " ms";
		message.channel.send(`🏓 Pong !\n*ton ping: ${ping}*`);
	},
};