const mongoose = require('mongoose');

const FocusEventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true },
  durationSeconds: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('FocusEvent', FocusEventSchema);
