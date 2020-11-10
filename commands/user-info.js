module.exports = {
	name: 'user-info',
	description: 'User infos',
	execute(message, args) {
	    message.channel.send(`Ton username: ${message.author.username}\nTon ID: ${message.author.id}`);
	},
};
