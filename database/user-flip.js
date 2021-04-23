const mongoose = require("mongoose");

const UserFlipSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  score: { type: Number },
  best: {type : Number},
  score_bad: { type: Number, default: 0},
  best_bad: {type : Number, default: 0},
  lastUpdated: { type: Date }
});

module.exports = mongoose.model('UserFlip', UserFlipSchema);