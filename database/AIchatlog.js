const mongoose = require("mongoose");

const AIchatlogSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  history: { type: String },
  lastUpdated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('AIchatlog', AIchatlogSchema);