const express = require('express');
const router = express.Router();

const PresenceCheck = require('../models/PresenceCheck');
const QuizResponse = require('../models/QuizResponse');
const SessionReport = require('../models/SessionReport');

router.post('/presence-check', async (req, res) => {
  try {
    const presenceLog = new PresenceCheck(req.body);
    await presenceLog.save();
    res.status(201).json({ message: 'Presence check logged successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to log presence check.' });
  }
});

router.post('/quiz-response', async (req, res) => {
  try {

    console.log(req.body);
    const quizLog = new QuizResponse(req.body);
    await quizLog.save();
    res.status(201).json({ message: 'Quiz response logged successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to log quiz response.' });
  }
});

router.post('/session-summary', async (req, res) => {
  try {
    console.log("here");
    await SessionReport.findOneAndUpdate(
      { sessionId: req.body.sessionId },
      req.body,
      { upsert: true, new: true }
    );
    res.status(201).json({ message: 'Session summary logged successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to log session summary.' });
  }
});

module.exports = router;
