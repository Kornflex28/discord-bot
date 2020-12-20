const Discord = require('discord.js');
const ytdl = require("ytdl-core")
const fs =require("fs")
module.exports = {
	name: 'melee',
    description: 'Super Smash Brothers Meleeeeeeeeeee',
    cooldown: 2,
    aliases: ['ssbm'],
	execute(message, args) {
        const messageChannel = message.channel;
		url = 'https://www.youtube.com/watch?v=Q2Ax21yobJ0';
        let stream = ytdl(url,{filter: 'audioonly', format: 'mp3'});
        messageChannel.send('Laisse moi regarder ce que j\'ai...')
        const filename = 'surprise.mp3'
        stream.pipe(fs.createWriteStream(`files/${filename}`))
        .on('finish', () => {
            messageChannel.send('Et voila :musical_note:',{ files: [`files/${filename}`] }).then(()=>{message.channel.send('Ca c\'est du bon son, même un dé ne peut le nier :level_slider:')})
        })
        
    },
        
};