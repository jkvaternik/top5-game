const fs = require('fs');
const moment = require('moment');

const SUCCESS_MSG = 'Validation successful, all checks passed.';

/*
 * Validates the following conditions:
 * 1. all answers in a puzzle exist exactly as spelled in corresponding options_key list
 * 2. no puzzle dates or number are duplicated
 * 3. there are no missing dates between the earliest and latest puzzle
 */

function validatePuzzles() {
  // Load and parse JSON files
  const puzzles = JSON.parse(fs.readFileSync('app/data/puzzles.json', 'utf8'));
  const options = JSON.parse(fs.readFileSync('app/data/options.json', 'utf8'));

  const puzzleDates = Object.keys(puzzles).sort();
  const earliestDate = moment(puzzleDates[0]);
  const latestDate = moment(puzzleDates[puzzleDates.length - 1]);

  // Validate no missing dates
  for (let m = moment(earliestDate); m.diff(latestDate, 'days') <= 0; m.add(1, 'days')) {
    if (!puzzles[m.format('YYYY-MM-DD')]) {
      return `Missing date: ${m.format('YYYY-MM-DD')}`;
    }
  }

  const seenNumbers = new Set();
  // Validate puzzles
  for (const date of puzzleDates) {
    const puzzle = puzzles[date];

    // Check for duplicate puzzle numbers
    if (seenNumbers.has(puzzle.num)) {
      return `Duplicate puzzle number found: ${puzzle.num}`;
    }
    seenNumbers.add(puzzle.num);

    // Check if all answers exist in the corresponding optionsKey list
    const optionList = options[puzzle.optionsKey];
    if (!optionList) {
      return `Options key not found: ${puzzle.optionsKey}`;
    }

    for (const answer of puzzle.answers) {
      if (!optionList.includes(answer)) {
        return `Answer "${answer}" not found in options for key: ${puzzle.optionsKey}`;
      }
    }
  }

  // If all validations pass
  return SUCCESS_MSG;
}

const msg = validatePuzzles();
if (msg !== SUCCESS_MSG) {
  console.error(msg);
  process.exit(1);
} else {
  console.log(msg)
}