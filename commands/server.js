const Discord = require('discord.js')
const moment = require('moment')

const Usercommands = require("../database/uc.js");
Usercommands.setURL(process.env.LEVELS_DB_URL);
const excludedCommands = ['reload'];

module.exports = {
    name: 'server',
    description: 'Diverses informations peu utiles sur le serveur',
    aliases: ['serveur'],
    guildOnly: true,
    async execute(message, args) {
        let guildCommands = await Usercommands.fetchGuildCommands(message.guild.id)
        let totalGuildCommandsCount = new Map()
        let totalUserCommandsCount = new Map()
        for (let userGuild of guildCommands) {
            let userCommandsCount = 0
            for (let [com, value] of userGuild.commands) {
                if (!excludedCommands.includes(com)) {
                    if (!totalGuildCommandsCount.has(com)) { totalGuildCommandsCount.set(com, value) }
                    else { totalGuildCommandsCount.set(com, value + totalGuildCommandsCount.get(com)) }
                    userCommandsCount += value
                }
            }
            totalUserCommandsCount.set(userGuild.userID, userCommandsCount)
        }

        let totalCommandsCounts = Array.from(totalGuildCommandsCount).sort(function (a, b) {
            return b[1] - a[1];
        })
        let totalUserCommandsCounts_ = Array.from(totalUserCommandsCount).sort(function (a, b) {
            return b[1] - a[1];
        })

        message.guild.members.fetch().then(fetchedMembers => {
            const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
            const totalIdle = fetchedMembers.filter(member => member.presence.status === 'idle');
            let serverEmbed = new Discord.MessageEmbed()
                .setTitle(message.guild.name)
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.guild.iconURL())
                .setDescription(`*créé le : ${moment(message.guild.createdAt).format('DD/MM/YYYY à hh:mm:ss')} par ${message.guild.owner.user.username}*`)
                .addField(`${message.guild.memberCount} membres`, `:satellite: ${totalOnline.size} en ligne\n:crescent_moon: ${totalIdle.size} inactif${totalIdle.size > 1 ? 's' : ''}`, true)
                .addField(`${message.guild.roles.cache.size - 1} roles`, `${message.guild.roles.cache.filter(r => r.name != '@everyone').map(r => r.name).join(', ')}`, true)
                .addField(`${message.guild.channels.cache.filter(ch => ch.type != 'category').size} salons`, `${message.guild.channels.cache.filter(ch => ch.type === 'text').size} textuel\n${message.guild.channels.cache.filter(ch => ch.type === 'voice').size} vocal`, true)
                .addField(`Commandes sur ${message.guild.name}`, `Exécutées : ${totalCommandsCounts.reduce((r, a) => r.map((b, i) => a[i] + b))[1]}\nTop 5 : ${totalCommandsCounts.slice(0, 5).map(t => t[0]).join(', ')}`)
                .addField(`Classement des membres par commande de ${message.client.user.username} éxecutée`, `${totalUserCommandsCounts_.slice(0, 10).map((t, idx) => (idx + 1) + '. ' + message.guild.members.cache.get(t[0]).user.username + ': ' + t[1]).join('\n')}`)
                .setTimestamp()
                .setFooter('Données fournies grâce à l\'omniprésence de Dédé', message.client.user.displayAvatarURL());

            message.channel.send(serverEmbed);
        }).catch(error => {
            console.log(error);
            return message.channel.send('Aie j\'ai fait tomber tous mes dés. Attends un peu.');
        })
    }
};