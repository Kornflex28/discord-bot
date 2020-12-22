const Discord = require("discord.js")
module.exports = {
	name: 'server',
    description: 'Server infos',
    aliases:['serveur'],
    guildOnly: true,
	execute(message, args) {
        // message.guild.joined_at.fetch().then(ts => {console.log(ts)});
        message.guild.members.fetch().then(fetchedMembers => {
            const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
        let serverEmbed = new Discord.MessageEmbed()
        .setTitle(message.guild.name)
        .setColor('RANDOM')
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Créé le : ${message.guild.createdAt.toLocaleDateString()} par ${message.guild.owner.user.username}`)
        .addField('Nombre de membres',`:satellite: ${totalOnline.size} en ligne / ${message.guild.memberCount}`)
        .setTimestamp()
        message.channel.send(serverEmbed);
        })
    }
};