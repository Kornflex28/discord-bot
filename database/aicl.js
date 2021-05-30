const mongoose = require("mongoose");
const AIchatlog = require("./AIchatlog.js");

let mongoUrl;
let chatStart = `Human: Hello, who are you?\nAI: My name is Dédé.I was created by a genius.\nHuman:What do you do ?\nAI: I play with dice and sometimes your life. How can I help you today?\n`

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
                history:`${chatStart}${content}\n`
            });

            await newUser.save().catch(e => console.log(`Failed to save new user.`));

            return newUser;
        };
        user.history = `${user.history}${content}\n`
        await user.save().catch(e => console.log(`Failed to append xp: ${e}`));

        return user;
    }
}

module.exports = AIuserchatlog;