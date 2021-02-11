const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    process_message(NlpManager, message, messageContent) {
        const client = message.client;
        let args =[];
        //         client.commands = new Discord.Collection();
        // const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));
        // for (const file of commandFiles) {
        // 	const command = require(`../commands/${file}`);
        // 	client.commands.set(command.name, command);
        // }
        NlpManager.process('fr', messageContent)
            .then(response => {
                // console.log(response);
                message.reply(response.answer);
                const intent = response.intent;
                if (intent === 'agent.birthday') {
                    let totalSeconds = (client.uptime / 1000);
                    let days = Math.floor(totalSeconds / 86400);
                    totalSeconds %= 86400;
                    let hours = Math.floor(totalSeconds / 3600);
                    totalSeconds %= 3600;
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = Math.floor(totalSeconds % 60);
                    let uptime = `${days > 0 ? `${days} ${days == 1 ? `jour, ` : 'jours, '}` : ``}${hours > 0 ? `${hours} ${hours == 1 ? 'heure, ' : 'heures, '}` : ``}${minutes > 0 ? `${minutes} ${minutes == 1 ? 'minute, ' : 'minutes, '}` : ``}${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`;
                    message.channel.send(`Après un peu plus de réflexion et de recherches, je date du 10 novembre 2020 environ et on m'a mis à jour pour la dernière fois il y a ${uptime}.`);
                }
                else if (intent.includes('command.')) {
                    const commandName = intent.slice(8);
                    const command = client.commands.get(commandName);
                    if (!command.args) {

                        if (commandName ==='roll') {args = [`${Math.floor(Math.random()*15)+1}`]}
                        
                        try {
                            command.execute(message, args);
                        } catch (error) {
                            console.error(error);
                            message.reply(`oups j\'ai du être mal lancé 🤕, il y a eu une erreur lors de l\'éxécution.\n\`${error}\``);
                        }
                    }
                }
            })
    }
}