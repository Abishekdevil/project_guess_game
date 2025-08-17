const express = require('express');
const router = express.Router();
const GameResult = require('../models/GameResult');
const verifyToken = require('../middleware/verifyToken');

router.post('/save-result', async (req, res) => {
  const { attempts, won } = req.body;
  const username = req.user.username;
  try {
    await new GameResult({ username, attempts, won }).save();
    res.json({ message: 'Saved' });
  } catch {
    res.status(500).json({ message: 'Save failed' });
  }
});

router.get('/history', async (req, res) => {
  const username = req.user.username;
  try {
    const history = await GameResult.find({ username }).sort({ timestamp: -1 });
    res.json(history);
  } catch {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

module.exports = router;
