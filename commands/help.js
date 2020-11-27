const { prefix, default_cooldown, creator_id } = require('../../config.json');
module.exports = {
	name: 'help',
	description: 'Liste de toutes mes faces (commandes) ou infos à propos d\'une face spécifique.',
	aliases: ['commands','info','infos'],
	usage: '<command name>',
	cooldown: 5,
	execute(message, args) {
		const data = [];
        const { commands } = message.client;

    if (!args.length) {
        data.push('Voici une liste de toutes mes faces (commandes):');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`\nTu peux envoyer \`${prefix}help <nom de commande>\` pour les infos specifiques à celle ci !`);

        return message.author.send(data, { split: true })
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
        return message.reply(`\`${name}\` n\'est pas encore une de mes faces (commande), si tu as une idée de génie tu peux toujours envoyer un message à <@${creator_id}> (gros tocard askip).`);
    }

    data.push(`**Nom:** ${command.name}`);

    if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || default_cooldown} s`);

    message.channel.send(data, { split: true });

    },
};