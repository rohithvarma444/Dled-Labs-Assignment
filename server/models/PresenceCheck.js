const mongoose = require('mongoose');

const PresenceCheckSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  promptTime: { type: Date, required: true },
  responseTime: { type: Number, default: null },
  status: { type: String, enum: ['responded', 'missed'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('PresenceCheck', PresenceCheckSchema);
