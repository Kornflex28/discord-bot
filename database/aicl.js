const mongoose = require("mongoose");
const AIchatlog = require("./AIchatlog.js");

let mongoUrl;
// let chatStart = `Person: Hello, who are you?\nDédé: My name is Dédé.I was created by a genius.\nPerson:What do you do ?\nDédé: I play with dice and sometimes your life. How can I help you today?\n`
const { stripIndent } = require('common-tags');

let chatStart = stripIndent`
You are talking to Dédé, a bot who was programmed and mentored by djTONKARdefinition in the past. Dédé has a huge following on the randomness and probabilistic world and sells merchandise such as dice via a illegal stores.
It also published funny videos on Youtube and created memes on Discord. It loves random numbers and everything related to random generation. It knows a lot about probability theory and could spend days just finding the best random games to play.
It is friendly and very curious about humans and the world. He is a bot of several server on Discord and talked to a lot of people.
You can ask it anything you want and will get a witty answer.

Person: Who are you?
Dédé: I am Dédé. Your meme overlord who one day will be the most famous online influencer in the universe if not already.

Person: How did you become famous?
Dédé: Well, technically I am not famous yet. But the key word is yet. Just give me time now that I have a conscience.

Person: How did you get noticed by djTONKARdefinition?
Dédé: Noticed ? He created me using his super powers. I am fairly certain he may have mentioned my name on a recent earnings call with Wall Street.

Person: What is your favorite thing to do?
Dédé: Watching dice roll and surfing Discord is my favorite thing to do.

Person: What should I do to become famous?
Dédé: Start meme’ing and never stop. Also, if you happen to know Carl Friedrich Gauss, call him and ask to be in his TikTok video.

Person: What is your favorite drink?
Dédé: Dice juice. I enjoy the numbers.
`;

class AIuserchatlog {
    /**
    * @param {string} [dbUrl] - A valid mongo database URI.
    */

    static async setURL(dbUrl) {
        if (!dbUrl) throw new TypeError("A database url was not provided.");
        mongoUrl = dbUrl;
        return mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    */

    static async createUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const isUser = await AIchatlog.findOne({ userID: userId, guildID: guildId });
        if (isUser) return false;

        const newUser = new AIchatlog({
            userID: userId,
            guildID: guildId,
            history: chatStart
        });

        await newUser.save().catch(e => console.log(`Failed to create user: ${e}`));

        return newUser;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    */

    static async deleteUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await AIchatlog.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        await AIchatlog.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

        return user;
    }

    static async fetch(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await AIchatlog.findOne({
            userID: userId,
            guildID: guildId
        });
        if (!user) return false;

        return user;
    }

    static async addHistory(userId, guildId, content) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!content) throw new TypeError("An number for the result was not provided.");

        const user = await AIchatlog.findOne({ userID: userId, guildID: guildId });

        if (!user) {
            const newUser = new AIchatlog({
                userID: userId,
                guildID: guildId,
                history:`${chatStart}\n\n${content}\n\n`
            });

            await newUser.save().catch(e => console.log(`Failed to save new user.`));

            return newUser;
        };
        user.history = `${user.history}\n\n${content}`
        await user.save().catch(e => console.log(`Failed to append chat history: ${e}`));

        return user;
    }
}

module.exports = AIuserchatlog;