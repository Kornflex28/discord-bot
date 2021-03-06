const Discord = require('discord.js');
require('dotenv').config();
const Levels = require('discord-xp');
Levels.setURL(process.env.LEVELS_DB_URL);

module.exports = {
	name: 'leaderboard',
    description: 'Leaderboard des utilisateurs dans ce serveur',
    guildOnly:true,
    aliases:['lb'],
    usage: '',
	async execute(message, args) {
        const n_user = 10;
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, n_user); 
        if (rawLeaderboard.length < 1) return reply("Personne n'est dans le leaderboard encore et c'est bien triste..");
        const leaderboard = await Levels.computeLeaderboard(message.client, rawLeaderboard, true);

        const lbEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setTitle(`Leaderboard du serveur ${message.guild.name}`)
                    .setDescription(`Top ${n_user} des utilisateurs du serveur`)
                    .setThumbnail(`${message.guild.iconURL()}`)
                    .setTimestamp()
                    .setFooter('Les données sont calculées par des algorithmes très savants et Dédé certifie l\'exactitude des nombres présentés');
        leaderboard.forEach(user=>lbEmbed.addField(`${user.position}. ${user.username}`,`Niveau ${user.level} (XP: ${user.xp.toLocaleString()})`))
		message.channel.send(lbEmbed);        
    },
};
