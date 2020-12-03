const Discord = require('discord.js');
require('dotenv').config();
const Levels = require('discord-xp');
Levels.setURL(process.env.LEVELS_DB_URL);

module.exports = {
	name: 'leaderboard',
    description: 'Leaderboard des utilisateurs dans ce serveur',
    guildOnly:true,
    usage: '',
	async execute(message, args) {
        const n_user = 10;
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, n_user); // We grab top 10 users with most xp in the current server.
        if (rawLeaderboard.length < 1) return reply("Personne n'est dans le leaderboard encore et c'est bien triste..");
        const leaderboard = await Levels.computeLeaderboard(message.client, rawLeaderboard, true); // We process the leaderboard.
        const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

        const lbEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`Leaderboard du serveur ${message.guild.name}`)
                    .setDescription(`Top ${n_user} des utilisateurs du serveur`)
                    .setThumbnail(`${message.guild.iconURL()}`)
                    .setTimestamp()
                    .setFooter('Les données sont calculées par des algorithmes très savants et Dédé certifie l\'exactitude des nombres présentés');
        leaderboard.forEach(user=>lbEmbed.addField(`${user.position}. ${user.username}`,`Niveau ${user.level} (XP: ${user.xp.toLocaleString()})`))
		message.channel.send(lbEmbed);        
    },
};
