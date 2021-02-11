const mongoose = require("mongoose");

const UserCommandsSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  commands: { type: Map },
  lastUpdated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('UserCommands', UserCommandsSchema);