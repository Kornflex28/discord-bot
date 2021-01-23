require('dotenv').config();
const Discord = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(process.env.LEVELS_DB_URL);

module.exports = {
    name: 'rank',
    description: 'Niveau d\'un utilisateur dans ce serveur ou celui de l\'auteur.e du message si aucun n\'est donné.',
    aliases: ['lvl', 'xp', 'profile', , 'profil', 'user-info'],
    guildOnly: true,
    usage: '@utilisateur ou rien',
    async execute(message, args) {
        const target = message.mentions.members.first() || message.member;
        if (target.id === process.env.BOT_ID) {
            const rankEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${target.user.username}`)
                .setDescription(`A rejoint le serveur le ${target.joinedAt.toLocaleDateString()}`)
                .setThumbnail(`${target.user.displayAvatarURL({ format: "png", dynamic: true })}`)
                .addField(`Niveau :infinity:`, `Prochain niveau: immédiatement`)
                .setTimestamp()
                .setImage('https://media.giphy.com/media/mXggOh7xql7MI/giphy.gif');
            return message.channel.send(rankEmbed);
        }
        const user = await Levels.fetch(target.id, message.guild.id);
        if (!user) return message.channel.send("Il semble que cette personne n'existe pas ou n'a pas encore décidé de gagner de l'experience..");

        const rankEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${target.user.username}`)
            .setDescription(`A rejoint le serveur le ${target.joinedAt.toLocaleDateString('fr', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
            .setThumbnail(`${target.user.displayAvatarURL({ format: "png", dynamic: true })}`)
            .addField(`Niveau ${user.level}`, `Prochain niveau: ${user.xp.toLocaleString('fr')}/${(100 * (user.level + 1) ** 2).toLocaleString('fr')} XP`)
            .setTimestamp()
        message.channel.send(rankEmbed)
    },
};
