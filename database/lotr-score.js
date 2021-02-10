const mongoose = require("mongoose");

const LotrScoresSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  total: { type: Number },
  wins: { type: Number },
  lastUpdated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('LotrScores', LotrScoresSchema);