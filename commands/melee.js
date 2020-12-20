const ytpl = require('ytpl')
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
        messageChannel.send('Et voila :musical_note:')
        messageChannel.send(url);
        messageChannel.send('Ca c\'est du bon son, même un dé ne peut le nier :level_slider:')
        
    },
        
};