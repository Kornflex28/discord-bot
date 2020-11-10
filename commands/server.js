module.exports = {
	name: 'server',
    description: 'Server infos',
    guildOnly: true,
	execute(message, args) {
        // message.guild.joined_at.fetch().then(ts => {console.log(ts)});
        console.log(message.guild)
        message.channel.send(`Nom du serveur: ${message.guild.name}\nNombre de membres: ${message.guild.memberCount}\nCréé le : ${message.guild.createdAt}`);
    }
};