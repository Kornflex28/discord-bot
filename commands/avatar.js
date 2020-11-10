module.exports = {
	name: 'avatar',
    description: 'Donne les liens des avatars des users mentionnés (très utile), si pas de mention ton propre avatar est donné.',
    usage: '<user1> <user2> ...',
	execute(message, args) {
	    if (!message.mentions.users.size) {
            return message.channel.send(`Ton avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        }
        const avatarList = message.mentions.users.map(user => {
            return `Avatar de ${user.username}: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
        message.channel.send(avatarList);
	},
};