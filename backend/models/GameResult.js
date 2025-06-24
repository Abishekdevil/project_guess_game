const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String, required: true },
  attempts: { type: Number, required: true },
  won: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameResult', schema);
