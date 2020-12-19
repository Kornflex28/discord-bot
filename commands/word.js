require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
const dict_url = "https://api.dicolink.com/v1/mots/motauhasard?avecdef=true&minlong=5&maxlong=-1&verbeconjugue=false&api_key=";

module.exports = {
	name: 'word',
    description: 'Lance les dés et obtiens un mot français aléatoire et sa définition',
    aliases:['mot'],
	execute(message, args) {
        message.channel.send('J\'ouvre mon dictionnaire...')
        fetch(dict_url+process.env.DICO_TOKEN).then(response => response.json())
        .then(json => {
            console.log(json);
            return json[0].mot
        })
        .then(word => {
            fetch("https://api.dicolink.com/v1/mot/"+`${word}/definitions?limite=3&source=larousse&api_key=`+process.env.DICO_TOKEN).then(response => response.json())
            .then(json => {
                console.log(json)
                if (json.error){return message.channel.send('Désolé mais mon dictionnaire s\'est déchiré on dirait... Réessaye si tu veux')}
                var def_str = new Discord.MessageEmbed()
                            .setTitle(word)
                            .setDescription('[Larousse](https://www.larousse.fr/)')
                            json.forEach(elem => {
                                
                                def_str.addField(elem.nature, elem.definition);
                            });
                message.channel.send(def_str);
            })
        })
	},
};