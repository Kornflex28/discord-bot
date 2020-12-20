const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const fs =require('fs')
module.exports = {
	name: 'melee',
    description: 'Super Smash Brothers Meleeeeeeeeeee',
    cooldown: 2,
    aliases: ['ssbm'],
	async execute(message, args) {
        const messageChannel = message.channel;
        const meleePlaylist = await ytpl('PL67D312AAC7F2E719');
        const videosUrl = meleePlaylist.items.map(video=>video.shortUrl);
        const url = videosUrl[Math.floor(Math.random()*videosUrl.length)]
        let stream = ytdl(url,{filter: 'audioonly', format: 'mp3'});
        messageChannel.send('Laisse moi regarder ce que j\'ai...')
        const filename = 'surprise.mp3'
        await stream.pipe(fs.createWriteStream(`files/${filename}`))
        messageChannel.send('Et voila :musical_note:',{ files: [`files/${filename}`] })
        .then(()=>{message.channel.send('Ca c\'est du bon son, même un dé ne peut le nier :level_slider:')})
        
    },
        
};