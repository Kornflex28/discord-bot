module.exports = {
	name: 'reload',
    description: 'Recharge une face (commande)',
    args: true,
    usage:'<nom de commande>',
	execute(message, args) {
		const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.reply(`je n'ai pas de face avec le nom ou l'alias \`${commandName}\` !`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Face \`${command.name}\` rechargée !`);
		} catch (error) {
			console.error(error);
			message.channel.send(`Il a y eu une erreur lors de la recharge d'une face \`${command.name}\`:\n\`${error.message}\``);
		}
    },
};