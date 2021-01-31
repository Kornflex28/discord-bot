const Discord  = require('discord.js');

require('dotenv').config()
module.exports = {
	name: 'help',
	description: 'Liste de toutes mes faces (commandes) ou infos à propos d\'une face spécifique.',
	aliases: ['commands','info','infos'],
	usage: '<command name>',
	cooldown: 5,
	execute(message, args) {
        const { commands } = message.client;

    if (!args.length) {
        let commandEmbed = new Discord.MessageEmbed()
        .setTitle(`Liste des commandes de Dédé`)
        .setDescription(`Tu peux envoyer \`${process.env.BOT_PREFIX}help <nom de commande>\` pour les infos specifiques à celle ci !`)
        .setColor(message.guild.me.displayHexColor)
        .setTimestamp()
        .setFooter('Documentation officielle de Dédé', message.client.user.displayAvatarURL());
        commandEmbed.addField('Commandes disponibles','```' + commands.map(command => command.name).join(', ')+'```');

        return message.author.send(commandEmbed)
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('je t\'ai envoyé en DM la liste de mes faces (très hot).');
            })
            .catch(error => {
                console.error(`Oups je n'ai pas pu envoyer les infos par DM à ${message.author.tag}.\n`, error);
                message.reply('j\'ai l\'impression que je ne peux pas t\'envoyer de DM. Sont-ils desactivés?');
            });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
        return message.reply(`\`${name}\` n\'est pas encore une de mes faces (commande), si tu as une idée de génie tu peux toujours envoyer un message à <@${process.env.CREATOR_ID}> (gros tocard askip).`);
    }

    let commandEmbed = new Discord.MessageEmbed()
    .setTitle(`Commande: ${command.name}`)
    .setDescription(`${command.description}`)
    .setColor(message.guild.me.displayHexColor)
    .setTimestamp()
    .setFooter('Documentation officielle de Dédé',message.client.user.displayAvatarURL());
    if (command.aliases) commandEmbed.addField('Alias', `${command.aliases.join(', ')}`);
    if (command.usage) commandEmbed.addField('Utilisation', `\`${process.env.BOT_PREFIX}${command.name} ${command.usage}\``);
    commandEmbed.addField('Cooldown', `${command.cooldown || parseInt(process.env.DEFAULT_COOLDOWN)} s`);
    message.channel.send(commandEmbed);
    },
};