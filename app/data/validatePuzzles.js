const fs = require("fs");
const moment = require("moment");

const SUCCESS_MSG = "Validation successful, all checks passed.";

/*
 * Validates the following conditions:
 * 1. all answers in a puzzle exist exactly as spelled in corresponding options_key list
 * 2. no puzzle dates or number are duplicated
 * 3. there are no missing dates between the earliest and latest puzzle
 */

function isSortedAlphabetically(arr, optionsKey) {
  const arrayCopy = [...arr];
  arrayCopy.sort();
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== arrayCopy[i]) {
      console.log(
        "options: " + optionsKey + ", " + arr[i] + " " + arrayCopy[i],
      );
      return false;
    }
  }
  return true;
}

const statParser = (stat) => {
  // Example 1: "1.2 million" -> 1200000
  // Example 2: "1,200" -> 1200
  // Example 3: "1,200.50" -> 1200.5
  // Example 4: "5.6 billion" -> 5600000000
  const regex = /[-+]?[0-9]*\.?[0-9]+/g;
  const cleanedStat = stat.replace(/,/g, "");
  const matches = cleanedStat.match(regex);

  if (!matches) return NaN;

  const parsedNumber = parseFloat(matches[0]);

  if (cleanedStat.toLowerCase().includes("trillion")) {
    return parsedNumber * 1e12;
  } else if (cleanedStat.toLowerCase().includes("billion")) {
    return parsedNumber * 1e9;
  } else if (cleanedStat.toLowerCase().includes("million")) {
    return parsedNumber * 1e6;
  }

  return parsedNumber;
};

const skipStatValidationForThesePuzzles = [
  "2024-09-04", // Dates
];

function validateStatsAreInOrder(puzzle, date) {
  if (skipStatValidationForThesePuzzles.includes(date)) {
    return;
  }
  const answerStats = puzzle.answers.map((answer) => statParser(answer.stat));
  const optionStats = puzzle.options.map((option) => statParser(option.stat));
  const allStats = [...answerStats, ...optionStats];

  const validateHighestFirst = allStats[0] > allStats[1];

  // Ensure that all stats are in order,
  // If any stat is not in order, return the puzzle number
  // We are flexible about whether sorting is descending or ascending (since that depends on the puzzle)
  // but they must be in order

  if (validateHighestFirst) {
    for (let i = 0; i < allStats.length - 1; i++) {
      if (allStats[i] < allStats[i + 1]) {
        return `Puzzle ${date} is not sorted: ${allStats[i]} is incorrectly listed before ${allStats[i + 1]}`;
      }
    }
  } else {
    for (let i = 0; i < allStats.length - 1; i++) {
      if (allStats[i] > allStats[i + 1]) {
        return `Puzzle ${date} is not sorted: ${allStats[i]} is incorrectly listed before ${allStats[i + 1]}`;
      }
    }
  }
}

function validatePuzzles() {
  // Load and parse JSON files
  const puzzles = JSON.parse(
    fs.readFileSync("app/data/puzzlesV2.json", "utf8"),
  );
  const options = JSON.parse(fs.readFileSync("app/data/options.json", "utf8"));

  const puzzleDates = Object.keys(puzzles).sort();
  const earliestDate = moment(puzzleDates[0]);
  const latestDate = moment(puzzleDates[puzzleDates.length - 1]);

  // Validate no missing dates
  for (
    let m = moment(earliestDate);
    m.diff(latestDate, "days") <= 0;
    m.add(1, "days")
  ) {
    if (!puzzles[m.format("YYYY-MM-DD")]) {
      return `Missing date: ${m.format("YYYY-MM-DD")}`;
    }
  }

  // Validate puzzles
  for (const date of puzzleDates) {
    const puzzle = puzzles[date];

    // Check if all answers exist in the corresponding optionsKey list
    const isNewOptionsFormat = !!puzzle.options;
    const optionList = isNewOptionsFormat
      ? puzzle.options
      : options[puzzle.optionsKey];
    if (!optionList) {
      return `Options key not found: ${puzzle.optionsKey}`;
    }

    if (isNewOptionsFormat) {
      if (puzzle.answers.length != 5) {
        return `Puzzle ${date} has ${puzzle.answers.length} answers`;
      }

      // Create a set of all the text values in the answers list
      const answerTextSet = new Set();
      puzzle.answers.forEach((answer) => {
        answer.text.forEach((text) => answerTextSet.add(text));
      });

      for (const option of puzzle.options) {
        // Check if text matches
        const textMatch = answerTextSet.has(option.text);
        if (textMatch) {
          return `Answer "${option.text}" with stat "${option.stat}" is incorrectly duplicated in options for puzzle: ${date}`;
        }
      }

      // Verify options are all sorted by stat
      // However, stat is often not a number, so we need to convert it to a number
      // Do this by removing non-numeric characters (except for '.') and then checking for "billion" or "million"
      // Example 1: "1.2 million" -> "1.2"
      // Example 2: "1,200" -> "1200"
      // Example 3: "1,200.50" -> "1200.5"

      const error = validateStatsAreInOrder(puzzle, date);
      if (error) {
        return error;
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
        return `Puzzle ${date} is not sorted`;
      }
    }

    // Check if all answers and options are unique
    const answerSet = new Set();
    const answersAndOptions = isNewOptionsFormat
      ? [...puzzle.answers, ...puzzle.options]
      : puzzle.answers;
    for (const option of answersAndOptions) {
      for (const text of option.text) {
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
  console.log(msg);
}
