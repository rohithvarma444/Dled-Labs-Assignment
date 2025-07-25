const mongoose = require('mongoose');

const FocusLossEventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  durationSeconds: {
    type: Number,
    required: true
  },
}, { _id: false });

const SessionReportSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  focusLossHistory: [FocusLossEventSchema],
  totalSwitches: {
    type: Number,
    required: true
  },
  totalTimeAway: {
    type: Number,
    required: true
  },
  trustscore: {
    type: Number,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('SessionReport', SessionReportSchema);
