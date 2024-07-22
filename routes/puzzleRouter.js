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

  const optionsList = options[puzzle.optionsKey];

  if (!optionsList) {
    return res.status(500).json({ error: 'Options not found for the puzzle' });
  }

  const fullPuzzle = {
    ...puzzle,
    options: optionsList
  };

  res.json(fullPuzzle);
});

// Route to return all puzzles
router.get('/puzzles', (req, res) => {
  const allPuzzles = Object.entries(puzzles).map(([date, puzzle]) => {
    const optionsList = options[puzzle.optionsKey];
    return {
      date,
      ...puzzle,
      options: optionsList || []
    };
  });

  res.json(allPuzzles);
});

module.exports = router;