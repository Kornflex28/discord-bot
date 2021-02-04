require('dotenv').config();
const moment = require('moment');
let schedule = require('node-schedule');

var leoProfanity = require('leo-profanity');
var frenchBadwordsList = require('french-badwords-list');
leoProfanity.clearList();
leoProfanity.add(frenchBadwordsList.array);

const Usercommands = require("./database/uc.js");
Usercommands.setURL(process.env.LEVELS_DB_URL);

const fs = require('fs');
const locales = JSON.parse(fs.readFileSync('./locales/fr-FR.json').toString());


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


const manager = new NlpManager({ languages: ['fr'], forceNER: true, modelFileName: './nlp/dede_fr_trained.nlp', nlu: { log: false } });

// manager.addCorpus('./nlp/corpus-fr-qna.json');
manager.addCorpus('./nlp/corpus-fr.json');

// Train and save the model.
(async () => {
    console.log('Training the model...')
    await manager.train();
})();

// let manager = new NlpManager();
// console.log('Loading NLP manager...')
// manager.load('./nlp/dede_fr.nlp');
// Adds the utterances and intents for the NLP



const minTime = 20 * 60 * 60 // 20 hours in s 
const maxTime = 72 * 60 * 60 // 72 hours in s
let interval = (Math.floor(Math.random() * (maxTime - minTime)) + minTime) * 1000; // in ms
let intervalId;
let creatorUser;
const activeTimeIntreval = 10 * 1000;


Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}


function startInterval(_interval, client, channelId, msgs) {
    // Store the id of the interval so we can clear it later
    intervalId = setInterval(function () {
        client.channels.fetch(channelId).then(channel => {
            channel.send(msgs.random());
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
                            xpChannel.send(`**${userInst.username}**, ${locales.levelUp.random()} Tu as gagné un niveau, tu es desormais niveau **${usr.level}**. :tada:`);
                            if (!(usr.level % 5)) {
                                const generalChannel = guild.channels.cache.find(ch => ch.name === 'general');
                                generalChannel.send(`:tada: **${userInst.username}**, ${locales.levelUp.random()} Tu as gagné un niveau, tu es desormais niveau **${usr.level}**. :tada:`);

                            }
                        }
                    }
                })
            }
        })
    } catch (error) { console.log(error) }
}

function sendNewYearWish(client) {
    client.guilds.cache.forEach(guild => {
        try {
            let generalChannel = guild.channels.cache.find(ch => (ch.name === 'general' || ch.name === 'général'))
            generalChannel.send('<:die1:776363179655168021> <:die2:776363694539931689> <:die3:776363694220771329> <:die4:776363694194950206> <:die5:776363694367965214> <:die6:776363694341750804>')
                .then(() => {
                    generalChannel.send(`Mais oui ! J'ai bien lu ma ligne du Temps, c'est une nouvelle année qui commence en France !\nJe vous souhaite à toutes et tous une bonne année ${new Date(Date.now()).getFullYear()} !!\nPour moi la prochaine année sera dans ${(Math.floor(Math.random() * 100000) + 1).toLocaleString()} jours terrestres et ce sera l'année d${(Math.floor(Math.random() * 1000) + 1)}`)
                    generalChannel.send('https://tenor.com/ulVX.gif')
                })
                .then(() => {
                    generalChannel.send('<:die6:776363694341750804> <:die5:776363694367965214> <:die4:776363694194950206> <:die3:776363694220771329> <:die2:776363694539931689> <:die1:776363179655168021>')
                })
        } catch (err) { console.log(err + ` in guild ${guild.name}`) }

    })

}

client.once('ready', async () => {

    client.user.setPresence({ activity: { name: `les dés | !help`, type: 'LISTENING' }, status: 'online' });
    console.log(`Bot logged in! ${process.env.IS_HEROKU ? 'Deployment version' : 'Development version'}`);
    creatorUser = await client.users.fetch(process.env.CREATOR_ID);
    let newYear = new Date(new Date(Date.now()).getFullYear() + 1, 0, 1)
    const timeOffsetToFrance = - 60 - newYear.getTimezoneOffset()
    newYear = new Date(newYear.getTime() + (timeOffsetToFrance) * 60000)
    schedule.scheduleJob(newYear, function () { sendNewYearWish(client) });
    console.log(`Scheduled task for ${newYear.toString()}`)


    startInterval(interval, client, process.env.OOPS_GENERAL_ID, locales.thoughts)
    readyMsg = `\`\`\`diff\n- Bot logged in! ${Date(Date.now()).toLocaleString()}\nInterval = ${(interval / (1000 * 60 * 60)).toFixed(2)} h\n\`\`\`${creatorUser}`;
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
    const channel = member.guild.channels.cache.find(ch => (ch.name === 'general' || ch.name === 'général'));
    if (!channel) return;
    channel.send(`${locales.welcome.random()} ${member} ! Petit lancer de dés pour fêter ça ?!`);
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
            channel.send(`${locales.lolVocalJoin.random()} <@${newMember.member.user.id}> arrive sur le vocal ${targetVoiceChannel}`);
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
            if (messageContent === "" && !message.attachments.size) {
                channel.send(locales.thoughts.random());
            } else {
                if (message.attachments.size) {
                    let files = message.attachments.map((att, id) => att.url)
                    channel.send(messageContent, { files: files })
                }
                else {
                    channel.send(messageContent);
                }
            }
            msg = `\`\`\`ini\n [mergez sent to ${channel.name}]\n\`\`\``
            sendToLogs(process.env.LOGS_CHANNEL_ID, msg)
        })
    }

    // DEVELOPMENT OR NOT 
    if (!process.env.IS_HEROKU && message.channel.id != process.env.TESTING_CHANNEL_ID) { return; }
    if (process.env.IS_HEROKU && message.channel.id == process.env.TESTING_CHANNEL_ID) { return; }

    if (message.author.bot) { return; }

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
                    xpChannel.send(`**${message.author.username}**, ${locales.levelUp.random()} Tu as gagné un niveau, tu es desormais niveau **${user.level}**. :tada:`);
                    if (!(user.level % 5)) {
                        const generalChannel = message.guild.channels.cache.find(ch => ch.name === 'general');
                        generalChannel.send(`:tada: **${message.author.username}**, ${locales.levelUp.random()} Tu as gagné un niveau, tu es desormais niveau **${user.level}**. :tada:`);

                    }
                }
            } catch (error) { console.log(error) }
        }

        const react_prob = Math.exp(-1);

        // reactions handling 
        if (['vie', 'damso', 'dems'].some(elem => message.content.toLowerCase().includes(elem))) {
            message.react('🖖');
        }

        if (['maisnan', 'mais nan'].some(elem => message.content.toLowerCase().includes(elem))) {
            message.react('🤯');
            message.reply('MAIS NAN ?!!');
        }

        if ((Math.random() < react_prob) && !message.content.includes('pendu')) {
            message.react(locales.emojis.random());
        }

        // bot mentions handling
        bot_id = client.user.id;
        let bot_roles = message.channel.type === 'dm' ? '' : message.guild.members.cache.get(client.user.id)._roles;
        let firstMention = message.content.match(/<@&(\d+)>/) ? message.content.match(/<@&(\d+)>/)[1] : '';
        if (message.content.startsWith(`<@!${bot_id}>`) || message.content.startsWith(`<@${bot_id}>`) || (message.content.startsWith(`<@&${firstMention}>`) && bot_roles.includes(firstMention))) {

            const messageContent = message.content.slice(bot_id.length + 4).trim();
            mentionMsg = `\`\`\`diff\n+ Bot mention by ${message.author.username} in ${message.channel.type === 'dm' ? "DM" : message.channel.name},\n ${messageContent}\n\`\`\``
            sendToLogs(process.env.LOGS_CHANNEL_ID, mentionMsg)

            nlpTools.process_message(manager, message, messageContent);
        }

        // commands handling
        if (message.content.startsWith(process.env.BOT_PREFIX)) {

            const args = message.content.slice(process.env.BOT_PREFIX.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            if (commandName) {

                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) {
                    message
                    if (Math.random() <= 0.2) { message.reply(`désolé mais \`${commandName}\` ${locales.commandError.random()} ${creatorUser}`) }
                    await message.react(client.emojis.cache.find(emoji => emoji.name === `die1`));
                    await message.react('🇳');
                    await message.react('🇴');
                    await message.react('🇵');
                    await message.react('🇪');
                    return;
                };

                if (command.guildOnly && message.channel.type === 'dm') {
                    return message.reply(`Je ne peux pas utiliser la face \`${commandName}\` en DM (désolé). 😬`);
                }

                if (command.creatorOnly && message.author.id != process.env.CREATOR_ID) {
                    return message.reply(locales.commandPermission.random())
                }

                if (command.args && !args.length) {
                    return message.reply(`${locales.argsError.random()}${command.usage ? `\nL'utilisation correcte serait: \`${process.env.BOT_PREFIX}${command.name} ${command.usage}\`` : ''}`);
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
                        return message.reply(` ${locales.cooldownError.random()}\nEncore \`${timeLeft.toFixed(1)} s\` de réutiliser ma face \`${command.name}\`.`);
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                try {
                    if (command.name != 'hangman') { message.react(client.emojis.cache.find(emoji => emoji.name === `die4`)) };
                    command.execute(message, args);
                    if (message.channel.type != 'dm' && process.env.IS_HEROKU) {
                        await Usercommands.addCommand(message.author.id, message.guild.id, command.name)
                    }
                } catch (error) {
                    console.error(error);
                    errorMsg = `\`\`\`css\n[Bot error]\n${error}}\n\`\`\``;
                    sendToLogs(process.env.LOGS_CHANNEL_ID, errorMsg)
                    message.reply(`${locales.executionError.random()}\n\`${error}\``);
                }

                commandMsg = `\`\`\`diff\n+ Command msg by ${message.author.username} in ${message.channel.type === 'dm' ? "DM" : message.channel.name}${message.channel.type != 'dm' ? `, ${message.guild.name}` : ''}\n ${message.content}\n\`\`\``;
                sendToLogs(process.env.LOGS_CHANNEL_ID, commandMsg)
            }
        }

        if (leoProfanity.check(message.content)) {
            message.reply(locales.profanityFilter.random())
        }
    }

});


client.login(process.env.BOT_TOKEN);
