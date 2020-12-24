let emojis = [
    '😄', '😃', '😀', '😊', '☺', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '👲', '👳', '👮', '👷', '💂', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾', '👹', '👺', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '💨', '👂', '👀', '👃', '👅', '👄', '👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈', '🙌', '🙏', '☝', '👏', '💪', '🚶', '🏃', '💃', '👫', '👪', '👬', '👭', '💏', '💑', '👯', '🙆', '🙅', '💁', '🙋', '💆', '💇', '💅', '👰', '🙎', '🙍', '🙇', '🎩', '👑', '👒', '👟', '👞', '👡', '👠', '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄', '💛', '💙', '💜', '💚', '❤', '💔', '💗', '💓', '💕', '💖', '💞', '💘', '💌', '💋', '💍', '💎', '👤', '👥', '💬', '👣', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐽', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐲', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '🐾', '💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂', '🌿', '🌾', '🍄', '🌵', '🌴', '🌲', '🌳', '🌰', '🌱', '🌼', '🌐', '🌞', '🌝', '🌚', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌜', '🌛', '🌙', '🌍', '🌎', '🌏', '🌋', '🌌', '🌠', '⭐', '☀', '⛅', '☁', '⚡', '☔', '❄', '⛄', '🌀', '🌁', '🌈', '🌊', '🎍', '💝', '🎎', '🎒', '🎓', '🎏', '🎆', '🎇', '🎐', '🎑', '🎃', '👻', '🎅', '🎄', '🎁', '🎋', '🎉', '🎊', '🎈', '🎌', '🔮', '🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎', '📞', '📟', '📠', '📡', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '📢', '📣', '⏳', '⌛', '⏰', '⌚', '🔓', '🔒', '🔏', '🔐', '🔑', '🔎', '💡', '🔦', '🔆', '🔅', '🔌', '🔋', '🔍', '🛁', '🛀', '🚿', '🚽', '🔧', '🔩', '🔨', '🚪', '🚬', '💣', '🔫', '🔪', '💊', '💉', '💰', '💴', '💵', '💷', '💶', '💳', '💸', '📲', '📧', '📥', '📤', '✉', '📩', '📨', '📯', '📫', '📪', '📬', '📭', '📮', '📦', '📝', '📄', '📃', '📑', '📊', '📈', '📉', '📜', '📋', '📅', '📆', '📇', '📁', '📂', '✂', '📌', '📎', '✒', '✏', '📏', '📐', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖', '📛', '🔬', '🔭', '📰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲', '🎯', '🏈', '🏀', '⚽', '⚾', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣', '☕', '🍵', '🍶', '🍼', '🍺', '🍻', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢', '🚢', '⛵', '🚤', '🚣', '⚓', '🚀', '✈', '💺', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃', '🚎', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚖', '🚛', '🚚', '🚨', '🚓', '🚔', '🚒', '🚑', '🚐', '🚲', '🚡', '🚟', '🚠', '🚜', '💈', '🚏', '🎫', '🚦', '🚥', '⚠', '🚧', '🔰', '⛽', '🏮', '🎰', '♨', '🗿', '🎪', '🎭', '📍', '🚩', '⬆', '⬇', '⬅', '➡', '🔠', '🔡', '🔤', '↗', '↖', '↘', '↙', '↔', '↕', '🔄', '◀', '▶', '🔼', '🔽', '↩', '↪', 'ℹ', '⏪', '⏩', '⏫', '⏬', '⤵', '⤴', '🆗', '🔀', '🔁', '🔂', '🆕', '🆙', '🆒', '🆓', '🆖', '📶', '🎦', '🈁', '🈯', '🈳', '🈵', '🈴', '🈲', '🉐', '🈹', '🈺', '🈶', '🈚', '🚻', '🚹', '🚺', '🚼', '🚾', '🚰', '🚮', '🅿', '♿', '🚭', '🈷', '🈸', '🈂', 'Ⓜ', '🛂', '🛄', '🛅', '🛃', '🉑', '㊙', '㊗', '🆑', '🆘', '🆔', '🚫', '🔞', '📵', '🚯', '🚱', '🚳', '🚷', '🚸', '⛔', '✳', '❇', '❎', '✅', '✴', '💟', '🆚', '📳', '📴', '🅰', '🅱', '🆎', '🅾', '💠', '➿', '♻', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '🏧', '💹', '💲', '💱', '©', '®', '™', '〽', '〰', '🔝', '🔚', '🔙', '🔛', '🔜', '❌', '⭕', '❗', '❓', '❕', '❔', '🔃', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '✖', '➕', '➖', '➗', '♠', '♥', '♣', '♦', '💮', '💯', '✔', '☑', '🔘', '🔗', '➰', '🔱', '🔲', '🔳', '◼', '◻', '◾', '◽', '▪', '▫', '🔺', '⬜', '⬛', '⚫', '⚪', '🔴', '🔵', '🔻', '🔶', '🔷', '🔸', '🔹'
];

const lvlUpMessages = ['MAIS NAN ?!', 'c\'est pas trop tôt !', 'ah bah enfin..', 'youpi.', 'waouh !!', 'mais wesh ??', 'jure !', 'est-ce bien ce que je vois ?'];
const moment = require('moment');
var schedule = require('node-schedule');

const fs = require('fs');
require('dotenv').config();

const Twit = require('twit')
let T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});
let stream;

const { NlpManager } = require('node-nlp');
const nlpTools = require('./nlp/nlp_process.js')
const thoughts = './nlp/thoughts.txt';

const Levels = require('discord-xp');
Levels.setURL(process.env.LEVELS_DB_URL);

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


const manager = new NlpManager({ languages: ['fr'], forceNER: true, modelFileName: './nlp/dede_fr.nlp', nlu: { log: false } });
// Adds the utterances and intents for the NLP
manager.addCorpus('./nlp/corpus-fr.json');

// Train and save the model.
(async () => {
    console.log('Training the model...')
    await manager.train();
})();


const minTime = 20 * 60 * 60 // 20 hours in s 
const maxTime = 72 * 60 * 60 // 72 hours in s
let interval = (Math.floor(Math.random() * (maxTime - minTime)) + minTime) * 1000; // in ms
let msgs = [];
fs.readFile(thoughts, 'utf8', ((err, data) => {
    msgs = msgs.concat(data.split('\n'));
})
);
let intervalId;
const activeTimeIntreval = 10 * 1000;


function startInterval(_interval, client, channelId, msgs) {
    // Store the id of the interval so we can clear it later
    intervalId = setInterval(function () {
        client.channels.fetch(channelId).then(channel => {
            channel.send(msgs[Math.floor(Math.random() * msgs.length)]);
            clearInterval(intervalId);
            interval = (Math.floor(Math.random() * (maxTime - minTime)) + minTime) * 1000; // in ms
            msg = `\`\`\`ini\n [saucisse sent to ${channel.name}, new Interval = ${(interval / (1000 * 60 * 60)).toFixed(2)} h]\n\`\`\``
            sendToLogs(process.env.LOGS_CHANNEL_ID, msg)
            startInterval(interval, client, channelId, msgs);
        })
            .catch(console.error); // add error handling here
    }, _interval);
}

function sendToLogs(LOGS_CHANNEL_ID, msg) {
    client.channels.fetch(LOGS_CHANNEL_ID).then(channel => {
        channel.send(msg)
    });
}

function addXpToActiveUsers(client) {

    try {
        let targetMessageChannel = '🥋macron-vs-sardoche'
        client.guilds.cache.forEach(guild => {
            let MvSChannel = guild.channels.cache.find(ch => ch.name === targetMessageChannel);
            if (!MvSChannel) {
                guild.channels.create(targetMessageChannel, { topic: 'Stream des tweets de Macron et Sardoche\nN\'hésitez pas à mute le salon', parent: guild.channels.cache.find(ch => ch.name === 'Text Channels') }).then(ch => MvSChannel = ch)
            }
        })
    } catch (error) { console.log(error) }


    try {
        let targetMessageChannel = '🌾xp-farm';
        client.guilds.cache.forEach(guild => {
            if (guild.voiceStates.cache.size > 0) {
                guild.voiceStates.cache.forEach(async (user) => {
                    if (user.channelID != null) {
                        let xpChannel = guild.channels.cache.find(ch => ch.name === targetMessageChannel);
                        if (!xpChannel) {
                            guild.channels.create(targetMessageChannel, { topic: 'Spam lvl Up\nN\'hésitez pas à mute le salon' }).then(ch => xpChannel = ch)
                        }
                        const userInst = await client.users.fetch(user.id);
                        let randomAmountOfXp = Math.floor(Math.random() * 2) + 1; // Min 1, Max 2
                        const hasLeveledUp = await Levels.appendXp(user.id, user.guild.id, randomAmountOfXp);
                        if (hasLeveledUp) {
                            const usr = await Levels.fetch(user.id, user.guild.id);
                            xpChannel.send(`**${userInst.username}**, ${lvlUpMessages[Math.floor(Math.random() * lvlUpMessages.length)]} Tu as gagné un niveau, tu es desormais niveau **${usr.level}**. :tada:`);
                            if (!(usr.level % 5)) {
                                const generalChannel = guild.channels.cache.find(ch => ch.name === 'general');
                                generalChannel.send(`:tada: **${userInst.username}**, ${lvlUpMessages[Math.floor(Math.random() * lvlUpMessages.length)]} Tu as gagné un niveau, tu es desormais niveau **${usr.level}**. :tada:`);

                            }
                        }
                    }
                })
            }
        })
    } catch (error) { console.log(error) }
}

client.once('ready', () => {
    client.user.setPresence({ activity: { name: `les dés | !help`, type: 'LISTENING' }, status: 'online' });
    console.log('Bot logged in!');

    const newYear = new Date(new Date(Date.now()).getFullYear()+1,0,1)
    console.log(newYear.toString())
    const timeOffsetToFrance;
    console.log(newYear.getTimezoneOffset())

    startInterval(interval, client, process.env.OOPS_GENERAL_ID, msgs)
    readyMsg = `\`\`\`diff\n- Bot logged in! ${Date(Date.now()).toLocaleString()}\nInterval = ${(interval / (1000 * 60 * 60)).toFixed(2)} h\n\`\`\`<@${process.env.CREATOR_ID}>`;
    sendToLogs(process.env.LOGS_CHANNEL_ID, readyMsg)

    client.setInterval(addXpToActiveUsers, activeTimeIntreval, client);


    stream = T.stream('statuses/filter', { follow: ['898994539', '1976143068'] })
    stream.on('tweet', function (tweet) {
        let tweetUrl = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
        let targetMessageChannel = '🥋macron-vs-sardoche'
        try {
            if (['898994539', '1976143068'].includes(tweet.user.id_str)) {
                client.guilds.cache.forEach(guild => {
                    let MvSChannel = guild.channels.cache.find(ch => ch.name === targetMessageChannel);
                    MvSChannel.send(tweetUrl)
                })
            }
        } catch (error) {
            console.error(error);
        }
    })

});

// NEW MEMBER IN GUILD
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    channel.send(`Bienvenue chez les fous, ${member} ! Que dirais tu d'un petit lancer de dés pour fêter ça ?!`);
    n_dice = 5;
    dice = Array.from({ length: n_dice }, () => Math.floor(Math.random() * 6) + 1);
    die_emojis = dice.map(die => client.emojis.cache.find(emoji => emoji.name === `die${die}`));
    channel.send(`${die_emojis.join("")}`)
    guildAddMsg = `\`\`\`fix\n ${member.user.username} joined ${channel.name} in ${member.guild}\n\`\`\``
    sendToLogs(process.env.LOGS_CHANNEL_ID, guildAddMsg);

});

//JOINING VOICE CHANNEL
client.on('voiceStateUpdate', (oldMember, newMember) => {

    const targetVoiceChannel = 'LoL';
    const targetMessageChannel = 'general';
    const message_prob = 0.1;
    let newUserChannel = newMember.channel
    let oldUserChannel = oldMember.channel

    if (oldUserChannel === null && newUserChannel !== null) {
        if (newUserChannel.name === targetVoiceChannel && Math.random() < message_prob) {
            const channel = newMember.member.guild.channels.cache.find(ch => ch.name === targetMessageChannel);
            const lines = ['Et c\'est reparti...', 'Fidèle à soi même', 'Pour changer', 'Ah toi aussi ?', 'Mais NAN ?!', 'Indémodable'];
            channel.send(`${lines[Math.floor(Math.random() * lines.length)]} <@${newMember.member.user.id}> arrive sur le vocal ${targetVoiceChannel}`);
            voiceAddMsg = `\`\`\`bash\n "${newMember.member.user.username} joined ${targetVoiceChannel} in vocal in ${newMember.member.guild}"\n\`\`\``
            sendToLogs(process.env.LOGS_CHANNEL_ID, voiceAddMsg);
        }
    }

})

// MESSAGE 
client.on('message', async (message) => {

    if (message.content === '!!testjoin' && message.author.id == process.env.CREATOR_ID) {
        client.emit('guildMemberAdd', message.member);
    }

    if (message.content.startsWith('mergez') && message.author.id == process.env.CREATOR_ID) {
        const messageContent = message.content.slice('mergez'.length + 1).trim();
        client.channels.fetch(process.env.OOPS_GENERAL_ID).then(channel => {
            if (messageContent === "") {
                channel.send(msgs[Math.floor(Math.random() * msgs.length)]);
            } else {
                channel.send(messageContent);
            }
            msg = `\`\`\`ini\n [mergez sent to ${channel.name}]\n\`\`\``
            sendToLogs(process.env.LOGS_CHANNEL_ID, msg)
        })
    }

    if (message.author.bot) { return; }

    if (!message.author.bot) {

        console.log(`${moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')} ${message.channel.type === 'dm' ? '' : message.guild.name}, #${message.channel.type === 'dm' ? 'DM' : message.channel.name}, ${message.author.username}: "${message.cleanContent}"`);

        if (message.guild) {
            try {
                const targetMessageChannel = '🌾xp-farm';
                let xpChannel = message.guild.channels.cache.find(ch => ch.name === targetMessageChannel)
                if (!xpChannel) {
                    message.guild.channels.create(targetMessageChannel, { topic: 'Spam lvl Up\nN\'hésitez pas à mute le salon' }).then(ch => xpChannel = ch)
                }
                const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
                const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
                if (hasLeveledUp) {
                    const user = await Levels.fetch(message.author.id, message.guild.id);
                    xpChannel.send(`**${message.author.username}**, ${lvlUpMessages[Math.floor(Math.random() * lvlUpMessages.length)]} Tu as gagné un niveau, tu es desormais niveau **${user.level}**. :tada:`);
                    if (!(user.level % 5)) {
                        const generalChannel = message.guild.channels.cache.find(ch => ch.name === 'general');
                        generalChannel.send(`:tada: **${message.author.username}**, ${lvlUpMessages[Math.floor(Math.random() * lvlUpMessages.length)]} Tu as gagné un niveau, tu es desormais niveau **${user.level}**. :tada:`);

                    }
                }
            } catch (error) { console.log(error) }
        }

        const react_prob = Math.exp(-1);

        // reactions handling 
        if (['vie', 'damso'].some(elem => message.content.toLowerCase().includes(elem))) {
            message.react('🖖');
        }

        if (['maisnan', 'mais nan'].some(elem => message.content.toLowerCase().includes(elem))) {
            message.react('🤯');
            message.reply('MAIS NAN ?!!');
        }

        if ((Math.random() < react_prob) && !message.content.includes('pendu')) {
            message.react(emojis[Math.floor(Math.random() * emojis.length)]);
        }

        // bot mentions handling
        bot_id = client.user.id;
        let bot_roles = message.guild.members.cache.get(client.user.id)._roles
        let firstMention = message.content.match(/<@&(\d+)>/) ? message.content.match(/<@&(\d+)>/)[1] : '';
        if (message.content.startsWith(`<@!${bot_id}>`) || message.content.startsWith(`<@${bot_id}>`) || (message.content.startsWith(`<@&${firstMention}>`) && bot_roles.includes(firstMention))) {

            const messageContent = message.content.slice(bot_id.length + 4).trim();
            mentionMsg = `\`\`\`diff\n+ Bot mention by ${message.author.username} in ${message.channel.name}, ${message.guild.name}\n ${messageContent}\n\`\`\``
            sendToLogs(process.env.LOGS_CHANNEL_ID, mentionMsg)

            nlpTools.process_message(manager, message, messageContent);
        }

        // commands handling
        if (message.content.startsWith(process.env.BOT_PREFIX)) {

            const args = message.content.slice(process.env.BOT_PREFIX.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            if (commandName) {

                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) {
                    return message.reply(`désolé mais \`${commandName}\` n'est pas encore une de mes faces, si tu as une idée de génie tu peux toujours envoyer un message à <@${process.env.CREATOR_ID}> (gros tocard askip).`);
                };

                if (command.guildOnly && message.channel.type === 'dm') {
                    return message.reply(`Je ne peux pas utiliser la face \`${commandName}\` en DM (désolé). 😬`);
                }

                if (command.args && !args.length) {
                    let reply = 'désolé mais tu n\'as pas donné d\'argument. C\'est scandaleux !';

                    if (command.usage) {
                        reply += `\nL'utilisation correcte serait: \`${process.env.BOT_PREFIX}${command.name} ${command.usage}\``;
                    }

                    return message.reply(reply);
                }

                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown || parseInt(process.env.DEFAULT_COOLDOWN)) * 1000;

                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.reply(`my brooo, ne soit pas impatient.e 🤠! Attends un peu, encore ${timeLeft.toFixed(1)} s de réutiliser ma face \`${command.name}\`.`);
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                try {
                    command.execute(message, args);
                } catch (error) {
                    console.error(error);
                    errorMsg = `\`\`\`css\n[Bot error]\n${error}}\n\`\`\``;
                    sendToLogs(process.env.LOGS_CHANNEL_ID, errorMsg)
                    message.reply(`oups j\'ai du être mal lancé 🤕, il y a eu une erreur lors de l\'éxécution.\n\`${error}\``);
                }

                commandMsg = `\`\`\`diff\n+ Command msg by ${message.author.username} in ${message.channel.type === 'dm' ? "DM" : message.channel.name}${message.channel.type != 'dm' ? `, ${message.guild.name}` : ''}\n ${message.content}\n\`\`\``;
                sendToLogs(process.env.LOGS_CHANNEL_ID, commandMsg)
            }
        }
    }

});


client.login(process.env.BOT_TOKEN);
