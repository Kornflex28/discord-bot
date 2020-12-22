
const https = require('https');
const md5 = require('md5')
const fetch = require("node-fetch");
const Discord = require('discord.js');
htmlparser = require('node-html-parser');
const url ="https://poesie.webnet.fr/lesgrandsclassiques/Poemes";
const base_url = "https://poesie.webnet.fr";
const wiki_url = "https://fr.wikipedia.org/w/api.php?action=opensearch&search=";

function decodeString(str) {
    return str.replace(/&#x27;/g,'\'')
            .replace(/&quot;/g,'"')
            .replace(/&#xE2;/g,'â')
            .replace(/&#xC2;/g,'Â')
            .replace(/&#xE0;/g,'à')
            .replace(/&#xC0;/g,'À')
            .replace(/&#xF4;/g,'ô')
            .replace(/&#xD4;/g,'Ô')
            .replace(/&#xE9;/g,'é')
            .replace(/&#xC9;/g,'É')
            .replace(/&#xE8;/g,'è')
            .replace(/&#xC8;/g,'È')
            .replace(/&#xEA;/g,'ê')
            .replace(/&#xCA;/g,'Ê')
            .replace(/&#xEB;/g,'ë')
            .replace(/&#xCB;/,'Ë')
            .replace(/&#xEE;/g,'î')
            .replace(/&#xCE;/g,'Î')
            .replace(/&#xEF;/g,'ï')
            .replace(/&#xCF;/g,'Ï')
            .replace(/&#xFB;/g,'û')
            .replace(/&#xDB;/g,'Û')
            .replace(/&#xF9;/g,'ù')
            .replace(/&#xD9;/g,'Ù')
            .replace(/&#xE7;/g,'ç')
            .replace(/&#xC7;/g,'Ç')
            .replace(/&#xFF;/g,'ÿ')
            .replace(/&#x178/g,'Ÿ');
};

module.exports = {
	name: 'poem',
    description: 'Lance le dé et obtient un poème aleatoire francais',
    aliases: ['poésie','poeme','poème','poesie'],
    cooldown: 15,
	execute(message, args) {
        
        https.get(url, (response=>{
           const poem_url = response.rawHeaders[response.rawHeaders.indexOf("Location")+1];
        //    console.log(poem_url)
        //    console.log(url+poem_url)
           https.get(base_url+poem_url, function(res) {
            let data = "";
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on("end", function() {
                const root = htmlparser.parse(data);

                const poem_content = decodeString(root.querySelector(".poem__content").toString())
                                .replace(/<br>/g,'\n')
                                //.replace(/\*/g,'')
                                .replace('<div class="poem__content">','').replace('</div>','');

                const poem_title = decodeString(root.querySelector(".poem__title").toString())
                                .replace('<h3 class="poem__title">','')
                                .replace('\n','')
                                .replace('</h3>','');
                // console.log(decodeString(root.querySelector(".poem__author").toString()))

                const poem_author = decodeString(root.querySelector(".poem__author").toString())
                                .replace('<h3 class="poem__author flag flag--big flag--france">','')
                                .replace('<h3 class="poem__author flag flag--big flag--canada">','')
                                .replace('<h3 class="poem__author flag flag--big flag--belgium">','')
                                .replace('<h3 class="poem__author flag flag--big flag--swiss">','')
                                .replace('<h3 class="poem__author flag flag--big flag--austria">','')
                                .replace('<a href="">','')
                                .replace('</a>','')
                                .replace('</h3>','')
                                .replace('<br>',', ')
                                .replace('\n','')
                                .replace(/ {2,}/g,'');

                wiki_search = encodeURIComponent(poem_author.split(',')[0].slice(1));
                let author_url = '';

                console.log('!POEM WIKI SEARCH: '+ wiki_url + wiki_search)
                
                // console.log(poem_content.length);
                if (poem_content.length>5500){
                    message.reply(' j\'ai trouvé un poème mais il est vraiment trop long... Relance moi si tu en veux un autre!');
                } else {
                    fetch(wiki_url + wiki_search)
                    .then(response=>response.json())
                    .then(json=>{
                        try {
                        author_url = json[3][0];
                        // console.log(author_url);
                        } catch (error) {console.log('Erreur avec le lien wiki de l\'auteur du poeme',error)}
                        return author_url;
                    })
                    .then(author_url => {
                        let nl_indices = [],i=-1;
                        while((i=poem_content.indexOf("\n",i+1))>=0) nl_indices.push(i);
                        const field_lim = 900;
                        let fields = [];
                        const n_blocks = Math.ceil(parseInt(nl_indices[nl_indices.length - 1])/field_lim);
                        // console.log(nl_indices,n_blocks);   
                        if (n_blocks > 1 ) {
                            let prev_idx = 0
                            for (let k=1;k<n_blocks;k++) {
                                const diffArr = nl_indices.map(x => Math.abs(k*field_lim - x));
                                // console.log(diffArr);
                                const minIdx = diffArr.indexOf(Math.min(...diffArr));
                                // console.log(minIdx,poem_content.slice(0,nl_indices[minIdx]),"---",poem_content.slice(nl_indices[minIdx]))
                                fields.push({name: `** **`, value: poem_content.slice(prev_idx,nl_indices[minIdx])});
                                prev_idx = nl_indices[minIdx];
                            }
                            fields.push({name: `** **`, value: poem_content.slice(prev_idx)});
                            // const index = diffArr.findIndex(x => x === minNumber);
                            // fields = [
                            //     {name: '** **', value: 1},
                            //     {name: '** **', value: 2}
                            // ];
                        }
                        else {
                            fields = [
                                {name: '** **', value: poem_content},
                            ];
                        }
                        if (author_url) {
                        const author_split = author_url.split('/');
                        // console.log(author_split)
                        const wiki_img_url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles="+author_split[author_split.length-1];
                        // console.log(wiki_img_url)
                        fetch(wiki_img_url)
                            .then(response => response.json())
                            .then(json => {
                                let poemEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(poem_title)
                                .setURL(author_url)
                                .setAuthor(poem_author)
                                .addFields(
                                    fields,
                                )
                                .setTimestamp()

                                try {
                                    const img_url = json.query.pages[Object.keys(json.query.pages)[0]]['original']['source'];
                                    poemEmbed.setThumbnail(`${img_url}`)

                                } catch (error) {console.log('Erreur avec image de l\'auteur du poeme',error)}
                                
                                // console.log(fields)
                                message.channel.send(poemEmbed);
                            })
                        } else {
                            let poemEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(poem_title)
                                .setAuthor(poem_author)
                                .addFields(
                                    fields,
                                )
                                .setTimestamp()
                            message.channel.send(poemEmbed);
                        }
                    })
                }
            })
        })
        })
    )
    return;

        // message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
