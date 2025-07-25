const mongoose = require('mongoose');

const QuizResponseSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  videoTimestamp: { type: Number, required: true },
  questionId: { type: Number, required: true },
  userAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('QuizResponse', QuizResponseSchema);
