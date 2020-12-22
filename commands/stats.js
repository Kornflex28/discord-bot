const Discord = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');

module.exports = {
    name: 'stats',
    description: 'Quelques infos sur ma propre personne',
    cooldown: 2,
    aliases:['stat'],
    async execute(message, args) {
        const d = moment.duration(message.client.uptime);
        const days = d.days();
        const hours = d.hours();
        const minutes = d.minutes();
        const seconds = d.seconds();
        let uptime = `${days > 0 ? `${days} ${days == 1 ? `jour, ` : 'jours, '}` : ``}${hours > 0 ? `${hours} ${hours == 1 ? 'heure, ' : 'heures, '}` : ``}${minutes > 0 ? `${minutes} ${minutes == 1 ? 'minute, ' : 'minutes, '}` : ``}${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`;
        const clientStats = stripIndent`
        Serveurs       :: ${message.client.guilds.cache.size}
        Utilisateurs   :: ${message.client.users.cache.size}
        Salons         :: ${message.client.channels.cache.size}
        WebSocket Ping :: ${Math.round(message.client.ws.ping)} ms
        Uptime         :: ${uptime}
        `;
        const { totalMemMb, usedMemMb } = await mem.info();
        const serverStats = stripIndent`
        OS              :: ${await os.oos()}
        CPU             :: ${cpu.model()}
        Coeurs          :: ${cpu.count()}
        Utilisation CPU :: ${await cpu.usage()} %
        RAM             :: ${totalMemMb} MB
        Utilisation RAM :: ${usedMemMb} MB 
        `;
        const embed = new Discord.MessageEmbed()
            .setTitle(`Statistiques de ${message.client.user.username} `)
            .setDescription(`\`${message.client.commands.size}\` commandes`)
            .addField('Client', `\`\`\`asciidoc\n${clientStats}\`\`\``)
            .addField('Serveur', `\`\`\`asciidoc\n${serverStats}\`\`\``)
            .addField(
                'Lien',
                `**[GitHub](https://github.com/Kornflex28/discord-bot)** | **[Invite moi sur ton serveur](https://discord.com/api/oauth2/authorize?client_id=775672151549149194&permissions=8&scope=bot)**`
            )
            .setFooter('Statistiques garanties sans Aléa grâce à PreviCorp ©', message.client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM');
        message.channel.send(embed);

    },
};