const Discord = require('discord.js');
require('dotenv').config();

function form_summmon(user, message) {
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
    aliases: ['appel'],
    args: true,
    guildOnly: true,
    execute(message, args) {

        const messageMentionsUsers = message.mentions.users;
        const messageMentionsRoles = message.mentions.roles;
        // console.log(message.mentions)
        let mentionnedUsers = [];
        messageMentionsUsers.forEach(usr=>{
            if (!mentionnedUsers.includes(usr)) {
                mentionnedUsers.push(usr);
            }
        })
        messageMentionsRoles.forEach(role=>{
            role.members.forEach(usr =>{
                if (!mentionnedUsers.includes(usr)) {
                    mentionnedUsers.push(usr);
                }
            })
            
        })
        if (message.mentions.everyone) {
            return message.channel.send('Oula je ne vais pas envoyer un DM à tout le monde, déso pas déso comme vous dites !')
        }
        else if (!messageMentionsUsers.size && !messageMentionsRoles.size) {
            message.channel.send('Je vais voir si je peux faire quelque chose')
            const gifCommand = message.client.commands.get('gif')
            return gifCommand.execute(message, args)
        }
        else {
            message.channel.send('L\'appel a été lancé... :postal_horn:')
            mentionnedUsers.forEach(usr => {
                if (usr.id != process.env.BOT_ID) {
                    form_summmon(usr, message)
                } else {
                    message.channel.send('https://tenor.com/6li4.gif');
                    message.channel.send('On m\'a appelé ?');
                }
            })
        }


    },
};