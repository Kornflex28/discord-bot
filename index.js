const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const { prefix, token, creator_id, default_cooldown } = config;

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


client.once('ready', () => {
    console.log('Bot logged in!');
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command){
        return message.reply(`désolé mais \`${commandName}\` n'est pas encore une de mes faces (commande), si tu as une idée de génie tu peux toujours envoyer un message à <@${creator_id}> (gros tocard askip).`);
    };

    if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply(`Je ne peux pas utiliser la face \`${commandName}\` en DM (désolé).`);
	}

    if (command.args && !args.length) {
        let reply = 'désolé mais tu n\'as pas donné d\'argument. C\'est scandaleux !';

		if (command.usage) {
			reply += `\nL'utilisation correcte serait: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.reply(reply);
        }
    
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
        
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || default_cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`my brooo, ne soit pas impatient ! Attends un peu, encore ${timeLeft.toFixed(1)} s de réutiliser ma face \`${command.name}\`.`);
        }
    }

    timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`oups j\'ai du être mal lancé, il y a eu une erreur lors de l\'éxécution.\n\`${error}\``);
    }

    // console.log(message)
    console.log(message.author.username, message.content);  
    
});

client.login(token);
