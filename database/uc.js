const mongoose = require("mongoose");
const userCommands = require("./user-commands.js");

let mongoUrl;

class Usercommands {

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

    const isUser = await userCommands.findOne({ userID: userId, guildID: guildId });
    if (isUser) return false;

    const newUser = new userCommands({
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

    const user = await userCommands.findOne({ userID: userId, guildID: guildId });
    if (!user) return false;

    await userCommands.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

    return user;
  }

  /**
  * @param {string} [userId] - Discord user id.
  * @param {string} [guildId] - Discord guild id.
  * @param {string} [commandName] - Name of a command.
  */

  static async addCommand(userId, guildId, commandName) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!commandName) throw new TypeError("An name of command was not provided.");

    const user = await userCommands.findOne({ userID: userId, guildID: guildId });

    if (!user) {
      const newUser = new userCommands({
        userID: userId,
        guildID: guildId,
        commands: new Map([[commandName, 1]])
      });

      await newUser.save().catch(e => console.log(`Failed to save new user.`));

      return newUser;
    };

    user.commands.set(commandName, user.commands.has(commandName) ? user.commands.get(commandName) + 1 : 1)

    await user.save().catch(e => console.log(`Failed to append xp: ${e}`));

    return user;
  }


  static async fetch(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await userCommands.findOne({
      userID: userId,
      guildID: guildId
    });
    if (!user) return false;

    return user;
  }

  static async fetchAll(){
    var users = await userCommands.find().exec();
    return users
  }
  
  /**
  * @param {string} [guildId] - Discord guild id.
  */


  static async fetchGuildCommands(guildId) {
    if (!guildId) throw new TypeError("A guild id was not provided.");

    var users = await userCommands.find({ guildID: guildId }).exec();

    return users;
  }

  /**
  * @param {string} [client] - Your Discord.CLient.
  */

  static async fetchGuildsCommands(client) {
    if (!client) throw new TypeError("A client was not provided.");

    let guildsCommands = new Map();

    for (let [guildId,guild] of client.guilds.cache) {
      if (!guildsCommands.has(guildId)) { guildsCommands.set(guildId, new Map()) }
      let guildUserCommands = await this.fetchGuildCommands(guildId)
      for (let usr of guildUserCommands) {
        let guildCommands = guildsCommands.get(guild.id)
        let userCommands = usr.commands
        for (let [command,value] of userCommands) {
          if (!guildCommands.has(command)) {
            guildCommands.set(command, value)
          } else {
            guildCommands.set(command, value + guildCommands.get(command))
          }
        }
        guildsCommands.set(guild.id,guildCommands)
      }
    };
    return guildsCommands
  }

}

module.exports = Usercommands;
