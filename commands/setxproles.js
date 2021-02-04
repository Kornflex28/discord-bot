require('dotenv').config();
fs = require('fs');
const locales = JSON.parse(fs.readFileSync('./locales/fr-FR.json').toString());

const Levels = require('discord-xp');
Levels.setURL(process.env.LEVELS_DB_URL);

module.exports = {
    name: 'setxproles',
    description: 'Créer les rôles liés au lvl d\'xp',
    creatorOnly: true,
    async execute(message, args) {
        let guildRoles = message.guild.roles;
        let users = await Levels.fetchLeaderboard(message.guild.id,limit=message.guild.members.cache.size);
        for (let user of users) {
            let userRole = locales.xpRoles.find(xpRole => xpRole.lvlId == Math.floor(user.level / 3))
            let guildRole = guildRoles.cache.find(r => r.name === userRole.data.name);
            if (!guildRole) {
                guildRole = await guildRoles.create({ data: userRole.data, reason: 'rôle lié au lvl d\'xp' });
            }
            let guildMember = message.guild.members.cache.find(us => us.id == user.userID);
            if (!guildMember.roles.cache.find(r => r.name == userRole.data.name)) {
                guildMember.roles.add(guildRole.id)
                message.channel.send(`*Rôle ${guildRole.name} attribué à ${guildMember.user.username}*`)
            } else {
                message.channel.send(`*Rôle ${guildRole.name} déjà attribué à ${guildMember.user.username}*`)
            }
        }

    }
}
