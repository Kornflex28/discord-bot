const mongoose = require("mongoose");
const LotrScores = require("./lotr-score.js");

let mongoUrl;

class LotrScore {

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

        const isUser = await LotrScores.findOne({ userID: userId, guildID: guildId });
        if (isUser) return false;

        const newUser = new LotrScores({
            userID: userId,
            guildID: guildId,
            total: 0,
            wins: 0,
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

        const user = await LotrScores.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        await LotrScores.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [result] - Result of the lotr.
    */

    static async addLotrScore(userId, guildId, result) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!result & result !=0) throw new TypeError("An number for the result was not provided.");

        const user = await LotrScores.findOne({ userID: userId, guildID: guildId });

        if (!user) {
            const newUser = new LotrScores({
                userID: userId,
                guildID: guildId,
                total: 1,
                wins: result > 0 ? 1 : 0,
            });

            await newUser.save().catch(e => console.log(`Failed to save new user.`));

            return newUser;
        };
        user.total = user.total+1
        user.wins = result > 0 ? user.wins + 1 : user.wins
        await user.save().catch(e => console.log(`Failed to append xp: ${e}`));

        return user;
    }


    static async fetch(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await LotrScores.findOne({
            userID: userId,
            guildID: guildId
        });
        if (!user) return false;

        return user;
    }


    /**
    * @param {string} [guildId] - Discord guild id.
    */


    static async fetchGuildLotrScores(guildId) {
        if (!guildId) throw new TypeError("A guild id was not provided.");

        var users = await LotrScores.find({ guildID: guildId }).exec();

        return users;
    }

    /**
    * @param {string} [client] - Your Discord.CLient.
    */
}

module.exports = LotrScore;
