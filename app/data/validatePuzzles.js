const fs = require('fs');
const moment = require('moment');

const SUCCESS_MSG = 'Validation successful, all checks passed.';

/*
 * Validates the following conditions:
 * 1. all answers in a puzzle exist exactly as spelled in corresponding options_key list
 * 2. no puzzle dates or number are duplicated
 * 3. there are no missing dates between the earliest and latest puzzle
 */

function isSortedAlphabetically(arr, optionsKey) {
  const arrayCopy = [...arr]
  arrayCopy.sort()
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== arrayCopy[i]) {
      console.log("options: " + optionsKey + ", " + arr[i] + " " + arrayCopy[i])
      return false
    }
  }
  return true;
}

function validatePuzzles() {
  // Load and parse JSON files
  const puzzles = JSON.parse(fs.readFileSync('app/data/puzzlesV2.json', 'utf8'));
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
    const isNewOptionsFormat = !!puzzle.options
    const optionList = isNewOptionsFormat ? puzzle.options : options[puzzle.optionsKey];
    if (!optionList) {
      return `Options key not found: ${puzzle.optionsKey}`;
    }

    if (isNewOptionsFormat) {
      for (const answer of puzzle.answers) {
        for (const option of puzzle.options) {
          // Check if both text and stat match
          const textMatch = answer.text.every((text, index) => text === option.text[index]);

          if (textMatch) {
            return `Answer "${answer.text.join(', ')}" with stat "${answer.stat}" is incorrectly duplicated in options for puzzle: ${puzzle.num}`;
          }
        }
      }
    } else {
      for (const answer of puzzle.answers) {
        for (const text of answer.text) {
          if (!optionList.includes(text)) {
            return `Answer "${text}" not found in options for key: ${puzzle.optionsKey}`;
          }
        }
      }

      // Verify options list is sorted alphabetically
      if (!isSortedAlphabetically(optionList, puzzle.optionsKey)) {
        return `Puzzle ${puzzle.num} is not sorted`
      }
    }

    // Check if all answers are unique
    const answerSet = new Set();
    for (const answer of puzzle.answers) {
      for (const text of answer.text) {
        if (answerSet.has(text)) {
          return `Duplicate answer found: ${text}`;
        }
        answerSet.add(text);
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