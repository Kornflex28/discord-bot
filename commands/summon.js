const Discord = require('discord.js');
require('dotenv').config();

function form_summmon(user,message) {
    const messageChannel = message.channel;
    // console.log(messageChannel)
    const messageAuthor = message.author;
    const messageTime = message.createdTimestamp;

    const msg = `**${messageAuthor.username}** te demande sur le serveur **${messageChannel.guild}** et plus précisement dans ${messageChannel}. Je cite:\n\`${message.cleanContent}\``;
    user.send(msg)
}

module.exports = {
    name: 'summon',
    description: 'Envoie un DM aux utilisateurs mentionnés du serveur pour leur faire comprendre qu\'ils sont expressément attendus ici',
    cooldown: 2,
    aliases:['appel'],
    args:true,
    guildOnly:true,
	execute(message, args) {
        
        const messageMentionsUsers = message.mentions.users;
        message.channel.send('L\'appel a été lancé... :postal_horn:')
        // console.log(messageMentionsUsers)
        if (!messageMentionsUsers.size) {
            const gifCommand = message.client.commands.get('gif')
            gifCommand.execute(message,args)
        }
        else {
            messageMentionsUsers.forEach(usr=>{
                if (usr.id != process.env.BOT_ID){
                    form_summmon(usr,message)
                } else {
                    message.channel.send('https://tenor.com/6li4.gif');
                    message.channel.send('On m\'a appelé ?');
                }
            })
        }


	},
};