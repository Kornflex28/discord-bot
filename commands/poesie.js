
const https = require('https');
const Discord = require('discord.js');
htmlparser = require('node-html-parser');
const url ="https://poesie.webnet.fr/lesgrandsclassiques/Poemes";
const base_url = "https://poesie.webnet.fr";

function decodeString(str) {
    return str.replace(/&#x27;/g,'\'')
            .replace(/&quot;/g,'"')
            .replace(/&#xE2;/g,'â')
            .replace(/&#xE0;/g,'à')
            .replace(/&#xF4;/g,'ô')
            .replace(/&#xD4;/g,'Ô')
            .replace(/&#xE9;/g,'é')
            .replace(/&#xC9;/g,'É')
            .replace(/&#xC8;/g,'È')
            .replace(/&#xE8;/g,'è')
            .replace(/&#xEA;/g,'ê')
            .replace(/&#xEE;/g,'î')
            .replace(/&#xEF;/g,'ï')
            .replace(/&#xFB;/g,'û')
            .replace(/&#xF9;/g,'ù')
            .replace(/&#xE7;/g,'ç');
};

module.exports = {
	name: 'poesie',
    description: 'Poeme aleatoire francais',
    alias: ['poésie'],
	execute(message, args) {
        
        https.get(url, (response=>{
           const poem_url = response.rawHeaders[response.rawHeaders.indexOf("Location")+1];
        //    console.log(poem_url)
        //    console.log(url+poem_url)
           https.get(base_url+poem_url, function(res) {
            var data = "";
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on("end", function() {
                const root = htmlparser.parse(data);

                const poem_content = decodeString(root.querySelector(".poem__content").toString())
                                .replace(/<br>/g,'\n')
                                .replace(/\*/g,'')
                                .replace('<div class="poem__content">','').replace('</div>','');

                const poem_title = decodeString(root.querySelector(".poem__title").toString())
                                .replace('<h3 class="poem__title">','')
                                .replace('\n','')
                                .replace('</h3>','');
                console.log(decodeString(root.querySelector(".poem__author").toString()))

                const poem_author = decodeString(root.querySelector(".poem__author").toString())
                                .replace('<h3 class="poem__author flag flag--big flag--france">','')
                                .replace('<h3 class="poem__author flag flag--big flag--canada">','')
                                .replace('<h3 class="poem__author flag flag--big flag--belgium">','')
                                .replace('<h3 class="poem__author flag flag--big flag--swiss">','')
                                .replace('<a href="">','')
                                .replace('</a>','')
                                .replace('</h3>','')
                                .replace('<br>',', ')
                                .replace('\n','')
                                .replace(/ {2,}/g,'');

                console.log(poem_content.length);

                var nl_indices = [],i=-1;
                while((i=poem_content.indexOf("\n",i+1))>=0) nl_indices.push(i);
                console.log(nl_indices);
                // message.channel.send(poem_content);
                // message.channel.send(`**${poem_title}**\n${poem_author}`);

                const poemEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(poem_title)
                // .setURL('https://discord.js.org/')
                .setAuthor(poem_author)
                // .setDescription(poem_content)
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                .addFields(
                    { name: '** **', value: poem_content },
                )
                .setTimestamp()

                message.channel.send(poemEmbed);
            })
        })
        })
    )

        // message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
