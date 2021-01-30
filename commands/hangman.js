require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const frNouns = './locales/french_nouns.txt';
const frVerbs = './locales/french_verbs.txt';
let hangman_init = process.env.HANGMAN;
let hangman;
if (!hangman_init) {
    hangman = []
    hangman_init = true;
}
const fetch = require('node-fetch');
const dict_url = "https://api.dicolink.com/v1/mot/";


function clean_str(str) {
    return str.toLowerCase()
        .replace('\'', ' ')
        .replace(/é/g, 'e')
        .replace(/è/g, 'e')
        .replace(/ê/g, 'e')
        .replace(/ë/g, 'e')
        .replace(/à/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ï/g, 'i')
        .replace(/î/g, 'i')
        .replace(/ô/g, 'o')
        .replace(/ö/g, 'o')
        .replace(/û/g, 'u')
        .replace(/ü/g, 'u')
        .replace(/ù/g, 'u')
        .replace(/ç/g, 'c')
        ;
};

let frWords = [];
fs.readFile(frNouns, 'utf8', ((err, data) => {
    frWords = frWords.concat(data.split('\n').filter(str => !(str.includes(';pl') || str.includes('-') || str.includes("'"))).map(str => clean_str(str.split(';')[0])));
})
);
fs.readFile(frVerbs, 'utf8', ((err, data) => {
    frWords = frWords.concat(data.split('\n').filter(str => !(str.includes('-') || str.includes("'"))).map(str => clean_str(str.split(';')[0])));
})
);
frWords.sort(() => Math.random() - 0.5);

function boardWord(word, letters) {
    let boardW = '';

    for (let i = 0; i < word.length; i++) {
        const ch = word[i]
        if (letters.includes(ch)) {
            boardW += `${ch} `;
        } else {
            boardW += `\\_ `;
        }
    }
    return boardW;
}



module.exports = {
    name: 'hangman',
    description: 'Je lance les dés pour trouver un mot aléatoire et joue au pendu',
    cooldown: 2,
    usage: '<"create"> ou <"board"> ou <lettre> ou <"endgame">',
    aliases: ['pendu'],
    args: true,
    guildOnly: true,
    execute(message, args) {
        const senderChannel = message.channel;
        const arg = clean_str(args[0]);
        let game = hangman.find(game => game._channelId == senderChannel.id);

        if (arg === 'create') {
            if (game !== undefined) {
                return message.reply('désolé mais une partie est déjà en cours dans ce channel !')
            } else {
                const word = frWords[Math.floor(Math.random() * frWords.length)];
                const lives = 7;
                const gameEmbed = new Discord.MessageEmbed()
                    .setColor(`RANDOM`)
                    .setTitle('Jeu du pendu de Dédé')
                    .setFooter(`channel: ${senderChannel.name ? senderChannel.name : 'DM'}`)
                    .setTimestamp()
                    .setDescription("```"
                        + "|‾‾‾‾‾‾|   \n|     "
                        + (lives < 7 ? "🎩" : " ")
                        + "   \n|     "
                        + (lives < 6 ? "😟" : " ")
                        + "   \n|   "
                        + (lives < 5 ? (lives < 4 ? (lives < 3 ? "🖖👕🖕" : "🖖👕") : "  👕") : " ")
                        + "   \n|     "
                        + (lives < 2 ? "🩳" : " ")
                        + "   \n|    "
                        + (lives < 1 ? "👞👞" : " ")
                        + "   \n|     \n|__________\n\n" + "```")
                    .addFields(
                        { name: 'Mot', value: `${boardWord(word, [])}`, inline: true },
                        { name: 'Lettres testées', value: `Aucune`, inline: true }
                    )

                senderChannel.send(gameEmbed).then(bot_message => {
                    game = {
                        "_guessWord": word,
                        "_guesses": [],
                        "_livesRemaining": 7,
                        "_channelId": `${senderChannel.id}`,
                        "_initiatorId": `${message.author.id}`,
                        "_lastMessage": bot_message
                    };
                    hangman.push(game);
                }).catch(e => {
                    console.log(e);
                    return message.channel.send('Aie le pendu s\'est échappé, désolé...')
                });

            }
        }
        else if (arg === 'endgame') {
            if (game == undefined) {
                return message.reply('désolé mais il n\'y a pas de partie en cours dans ce channel, essaye avec `!pendu create`')
            } else {
                const gameIndex = hangman.indexOf(game);
                game._lastMessage.delete();
                hangman.splice(gameIndex, 1);
                message.reply('j\'ai supprimé la partie en cours 😢');

            }
        }
        else if (arg === 'board') {
            if (game == undefined) {
                return message.reply('désolé mais il n\'y a pas de partie en cours dans ce channel, essaye avec `!pendu create`')
            } else {
                const gameEmbed = game._lastMessage.embeds[0];
                senderChannel.send(gameEmbed).then(bot_message => {
                    game._lastMessage.delete();
                    game._lastMessage = bot_message;
                }).catch(e => {
                    console.log(e);
                    return message.channel.send('Aie le pendu s\'est échappé, désolé...')
                })
            }
        }
        else if (arg.length != 1) {
            message.reply('une seule lettre à la fois !!')
        }
        else if (!arg.match(/^[a-z]+$/i)) {
            message.reply('il faut utiliser des lettres de l\'alphabet français de préférence..')
        }
        else {
            if (game == undefined) {
                return message.reply('désolé mais il n\'y a pas de partie en cours dans ce channel, essaye avec `!pendu create`')
            }
            if (game._guesses.includes(arg)) {
                message.reply(`tu as déjà essayé la lettre ${arg}...`)
                if (senderChannel.name) {
                    return message.delete()
                } else { return; }
            }
            if (senderChannel.name) {
                message.delete()
            }
            const gameEmbed = game._lastMessage.embeds[0];
            game._guesses.push(arg);

            gameEmbed.fields[1].value = `${game._guesses.join(", ")}`;

            if (!game._guessWord.includes(arg)) {
                game._livesRemaining += -1;
                gameEmbed.setDescription("```"
                    + "|‾‾‾‾‾‾|   \n|     "
                    + (game._livesRemaining < 7 ? "🎩" : " ")
                    + "   \n|     "
                    + (game._livesRemaining < 6 ? "😟" : " ")
                    + "   \n|   "
                    + (game._livesRemaining < 5 ? (game._livesRemaining < 4 ? (game._livesRemaining < 3 ? "🖖👕🖕" : "🖖👕") : "  👕") : " ")
                    + "   \n|     "
                    + (game._livesRemaining < 2 ? "🩳" : " ")
                    + "   \n|    "
                    + (game._livesRemaining < 1 ? "👞👞" : " ")
                    + "   \n|     \n|__________\n\n" + "```")
            } else {
                gameEmbed.fields[0].value = boardWord(game._guessWord, game._guesses);
            }

            senderChannel.send(gameEmbed).then(bot_message => {
                game._lastMessage.delete();
                game._lastMessage = bot_message;
                // message.react('🎲');
            }).catch(e => {
                console.log(e);
                return message.channel.send('Aie le pendu s\'est échappé, désolé...')
            })

            if (!game._livesRemaining) {
                senderChannel.send(`aie aie ça dégage ! Juste au cas où, le mot était *${game._guessWord}*`).then(() => {
                    fetch(dict_url + `${game._guessWord}/definitions?limite=3&source=larousse&api_key=` + process.env.DICO_TOKEN)
                        .then(response => { return response.json() }).catch(e => {
                            console.log(e);
                            return message.channel.send('Aie le pendu s\'est échappé, désolé...')
                        })
                        .then(json => {
                            if (json.error) { return; }
                            let def_str = new Discord.MessageEmbed()
                                .setTitle(game._guessWord)
                                .setDescription('[Larousse](https://www.larousse.fr/)')
                            json.forEach(elem => {

                                def_str.addField(elem.nature, elem.definition);
                            });
                            senderChannel.send(`Voilà ce que j'ai trouvé pour ce mot:`).then(() => senderChannel.send(def_str))
                        }).catch(e => {
                            console.log(e);
                            return message.channel.send('Aie le pendu s\'est échappé, désolé...')
                        });
                    const gameIndex = hangman.indexOf(game);
                    hangman.splice(gameIndex, 1);
                })
            }
            if (!game._lastMessage.embeds[0].fields[0].value.includes('\\_')) {
                senderChannel.send(`MAIS NAN ?! Bravo (c'était facile)`).then(() => {
                    fetch(dict_url + `${game._guessWord}/definitions?limite=3&source=larousse&api_key=` + process.env.DICO_TOKEN)
                        .then(response => { return response.json() }).catch(e => {
                            console.log(e);
                            return message.channel.send('Aie le pendu s\'est échappé, désolé...')
                        })
                        .then(json => {
                            if (json.error) { return; }
                            let def_str = new Discord.MessageEmbed()
                                .setTitle(game._guessWord)
                                .setDescription('[Larousse](https://www.larousse.fr/)')
                            json.forEach(elem => {

                                def_str.addField(elem.nature, elem.definition);
                            });
                            senderChannel.send(`Voilà ce que j'ai trouvé pour ce mot:`).then(() => senderChannel.send(def_str))
                        }).catch(e => {
                            console.log(e);
                            return message.channel.send('Aie le pendu s\'est échappé, désolé...')
                        });
                    const gameIndex = hangman.indexOf(game);
                    hangman.splice(gameIndex, 1);
                })
            }

        }
    },
};
