const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
	name: 'server',
    description: 'Diverses informations sur le serveur, peu utiles',
    aliases:['serveur'],
    guildOnly: true,
	execute(message, args) {
        // console.log(message.guild.channels.cache)
        message.guild.members.fetch().then(fetchedMembers => {
            const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
            const totalIdle = fetchedMembers.filter(member => member.presence.status === 'idle');
        let serverEmbed = new Discord.MessageEmbed()
        .setTitle(message.guild.name)
        .setColor('RANDOM')
        .setThumbnail(message.guild.iconURL())
        .setDescription(`*créé le : ${moment(message.guild.createdAt).format('DD/MM/YYYY à hh:mm:ss')} par ${message.guild.owner.user.username}*`)
        .addField(`${message.guild.memberCount} membres`,`:satellite: ${totalOnline.size} en ligne\n:crescent_moon: ${totalIdle.size} inactif${totalIdle.size>1 ? 's':''}`,true)
        .addField(`${message.guild.roles.cache.size -1} roles`,`${message.guild.roles.cache.filter(r=> r.name!='@everyone').map(r=>r.name).join(', ')}`,true)
        .addField(`${message.guild.channels.cache.filter(ch=>ch.type!='category').size} salons`,`${message.guild.channels.cache.filter(ch=>ch.type==='text').size} textuel\n${message.guild.channels.cache.filter(ch=>ch.type==='voice').size} vocal`,true)
        .setTimestamp()
        .setFooter('Données fournies grâce à l\'omniprésence de Dédé',message.client.user.displayAvatarURL());

        message.channel.send(serverEmbed);
        })
    }
};