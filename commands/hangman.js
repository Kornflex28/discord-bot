const config = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs');
const frNouns = './french_nouns.txt';
var { hangman } = config;

function clean_str(str) {
    return str.toLowerCase()
        .replace('\'', ' ')
        .replace('é', 'e')
        .replace('è', 'e')
        .replace('ê', 'e')
        .replace('ë','e')
        .replace('à', 'a')
        .replace('ä','a')
        .replace('ï','i')
        .replace('î','i')
        .replace('ô','o')
        .replace('ö','o')
        .replace('û','u')
        .replace('ü','u')
        .replace('ù','u')
        .replace('ç','c')
        ;
};

var frWords;
fs.readFile(frNouns ,'utf8', ((err, data) => {
    frWords = data.split('\n').filter(str=>!(str.includes(';pl')||str.includes('-')||str.includes("'"))).map(str=>clean_str(str.split(';')[0]));
    // console.log(frWords.splice(0,30));
    })
);

function boardWord(word, letters) {
    var boardW = '';

    for (var i = 0; i < word.length; i++) {
        const ch = word[i]
        if (letters.includes(ch)) {
            boardW += `${ch} `;
        } else {
            boardW += `\\_ `;
        }
    }
    return boardW;
}

hangman = [`
  +---+
  |   |
      |
      |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
      |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|\\\  |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|\\\  |
 /    |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|\\\  |
 / \\\  |
      |
=========
`];


module.exports = {
    name: 'hangman',
    description: 'Je lance les dés pour trouver un mot aléatoire et joue au pendu',
    cooldown: 2,
    usage: '',
    aliases: 'pendu',
    args: true,
    execute(message, args) {
        const senderChannel = message.channel;
        const arg = clean_str(args[0]);
        var game = hangman.find(game => game._channelId == senderChannel.id);

        if (message.author.id != config.creator_id) {
            return senderChannel.send('Désolé mais tu ne peux pas lancer cette commande encore');
        }

        if (arg === 'create') {
            if (game !== undefined) {
                return message.reply('désolé mais une partie est déjà en cours dans ce channel !')
            } else {
                const word = frWords[Math.floor(Math.random()*frWords.length)];
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
                    + (lives < 5 ? ( lives < 4 ? (lives < 3 ? "🖖👕🖕" : "🖖👕") : "  👕") : " ")
                    + "   \n|     "
                    + (lives < 2 ? "🩳" : " ")
                    + "   \n|    "
                    + (lives < 1 ? "👞👞" : " ")
                     + "   \n|     \n|__________\n\n"+ "```")
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
                } else {return ;}
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
                + (game._livesRemaining < 5 ? ( game._livesRemaining < 4 ? (game._livesRemaining < 3 ? "🖖👕🖕" : "🖖👕") : "  👕") : " ")
                + "   \n|     "
                + (game._livesRemaining < 2 ? "🩳" : " ")
                + "   \n|    "
                + (game._livesRemaining < 1 ? "👞👞" : " ")
                + "   \n|     \n|__________\n\n"+ "```")
            } else {
                gameEmbed.fields[0].value = boardWord(game._guessWord, game._guesses);
            }

            senderChannel.send(gameEmbed).then(bot_message => {
                game._lastMessage.delete();
                game._lastMessage = bot_message;
                // message.react('🎲');
            })

            if (!game._livesRemaining) {
                senderChannel.send(`aie aie ça dégage ! Juste au cas où, le mot était *${game._guessWord}*`).then(() => {
                    const gameIndex = hangman.indexOf(game);
                    hangman.splice(gameIndex, 1);
                })
            }
            if (!game._lastMessage.embeds[0].fields[0].value.includes('\\_')){
                senderChannel.send(`MAIS NAN ?! Bravo (c'était facile)`).then(() => {
                    const gameIndex = hangman.indexOf(game);
                    hangman.splice(gameIndex, 1);
                })
            }

        }
    },
};
