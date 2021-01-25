const mongoose = require("mongoose");

const UserFlipSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  score: { type: Number },
  best: {type : Number},
  lastUpdated: { type: Date }
});

module.exports = mongoose.model('UserFlip', UserFlipSchema);