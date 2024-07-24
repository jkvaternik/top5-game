const express = require('express');
const puzzles = require('../data/puzzles');
const options = require('../data/options');

const router = express.Router();

router.get('/puzzle', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  const puzzle = puzzles[date];

  if (!puzzle) {
    return res.status(404).json({ error: 'No puzzle found for the given date' });
  }

  res.json(puzzle);
});

// Route to return all puzzles
router.get('/puzzles', (req, res) => {
  const allPuzzles = Object.entries(puzzles).map(([date, puzzle]) => {
    return {
      date,
      ...puzzle
    };
  });

  res.json(allPuzzles);
});

router.get('/options', (req, res) => {
  const { optionsKey } = req.query;

  if (!optionsKey) {
    return res.status(400).json({ error: 'optionsKey parameter is required' });
  }

  const optionsList = options[optionsKey];
  res.json(optionsList);
});

module.exports = router;