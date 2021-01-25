const mongoose = require("mongoose");
const userFlip = require("./user-flip.js");

let mongoUrl;

class Userflip {

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

        const isUser = await userFlip.findOne({ userID: userId, guildID: guildId });
        if (isUser) return false;

        const newUser = new userFlip({
            userID: userId,
            guildID: guildId
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

        const user = await userFlip.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        await userFlip.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [result] - Result of the flip.
    * @param {date} [timestamp] - Date of a command.
    */

    static async addFlip(userId, guildId, result, timestamp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!timestamp) throw new TypeError("An date of command was not provided.");

        const user = await userFlip.findOne({ userID: userId, guildID: guildId });

        if (!user) {
            const newUser = new userFlip({
                userID: userId,
                guildID: guildId,
                score: result > 0 ? 1 : 0,
                best: result > 0 ? 1 : 0,
                lastUpdated: timestamp
            });

            await newUser.save().catch(e => console.log(`Failed to save new user.`));

            return newUser;
        };

        user.score = result > 0 ? user.score + 1 : 0
        user.best = (user.score) > user.best ? user.score : user.best
        user.lastUpdated = timestamp;

        await user.save().catch(e => console.log(`Failed to append xp: ${e}`));

        return user;
    }


    static async fetch(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await userFlip.findOne({
            userID: userId,
            guildID: guildId
        });
        if (!user) return false;

        return user;
    }


    /**
    * @param {string} [guildId] - Discord guild id.
    */


    static async fetchGuildFlips(guildId) {
        if (!guildId) throw new TypeError("A guild id was not provided.");

        var users = await userFlip.find({ guildID: guildId }).exec();

        return users;
    }

    /**
    * @param {string} [client] - Your Discord.CLient.
    */
}

module.exports = Userflip;
