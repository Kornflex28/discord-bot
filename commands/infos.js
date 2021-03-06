const Discord = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');

const Usercommands = require("../database/uc.js");
Usercommands.setURL(process.env.LEVELS_DB_URL);

const excludedCommands = ['reload'];
module.exports = {
    name: 'infos',
    description: 'Quelques infos sur ma propre personne',
    cooldown: 2,
    aliases: ['info'],
    async execute(message, args) {
        let guildsCommands = await Usercommands.fetchGuildsCommands(message.client);
        let commandsCounts = new Map()
        for (let [_, guildCommands] of guildsCommands) {
            for (let [command, commandCount] of guildCommands) {
                if (!excludedCommands.includes(command)) {
                    if (!commandsCounts.has(command)) {
                        commandsCounts.set(command, commandCount)
                    } else {
                        commandsCounts.set(command, commandCount + commandsCounts.get(command))
                    }
                }
            }
        }
        let totalCommandsCounts = Array.from(commandsCounts).sort(function (a, b) {
            return b[1] - a[1];
        })
        const commandsStats = stripIndent`
        Commandes           :: ${message.client.commands.size}
        Commandes exécutées :: ${totalCommandsCounts.reduce((r, a) => r.map((b, i) => a[i] + b))[1]}
        Top 5 commandes     :: ${totalCommandsCounts.slice(0, 5).map(t => t[0]).join(', ')}
        `;
        const d = moment.duration(message.client.uptime);
        const days = d.days();
        const hours = d.hours();
        const minutes = d.minutes();
        const seconds = d.seconds();
        let uptime = `${days > 0 ? `${days} ${days == 1 ? `jour, ` : 'jours, '}` : ``}${hours > 0 ? `${hours} ${hours == 1 ? 'heure, ' : 'heures, '}` : ``}${minutes > 0 ? `${minutes} ${minutes == 1 ? 'minute, ' : 'minutes, '}` : ``}${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`;
        const clientStats = stripIndent`
        Version        :: ${process.env.HEROKU_RELEASE_VERSION ? parseInt(process.env.HEROKU_RELEASE_VERSION.substring(1))/2 : 'développement'}
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
            .addField(`Commandes`, `\`\`\`asciidoc\n${commandsStats}\`\`\``)
            .addField('Client', `\`\`\`asciidoc\n${clientStats}\`\`\``)
            .addField('Serveur', `\`\`\`asciidoc\n${serverStats}\`\`\``)
            .addField(
                'Lien',
                `**[GitHub](https://github.com/Kornflex28/discord-bot)** | **[Invite moi sur ton serveur](https://discord.com/api/oauth2/authorize?client_id=775672151549149194&permissions=8&scope=bot)**`
            )
            .setFooter('Statistiques garanties sans Aléa grâce à PreviCorp ©', message.client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

    },
};