import { useState, useEffect } from 'react';
import puzzlesData from '../data/puzzlesV2.json';
import optionsData from '../data/options.json';
import { getCurrentLocalDateAsString, getPuzzleNumber } from '../utils';

export type Answer = {
  text: string[];
  stat: string | null;
};

export type RankedAnswer = Answer & {
  rank: number;
};

type PuzzleInput = {
  category: string;
  answers: Answer[];
  optionsKey?: string;
  options?: Answer[];
  url?: string;
};

export type Puzzle = {
  num: number;
  category: string;
  answers: Answer[];
  optionsKey?: string;
  options?: string[];
  optionsRanked?: RankedAnswer[];
  url?: string;
  submitter?: string;
};

export const puzzles: { [key: string]: PuzzleInput } = puzzlesData;
const options: { [key: string]: string[] } = optionsData;

// This hook returns the puzzle for the current day
// If there is no puzzle for today, it returns null
const useDailyPuzzle: (day: string | null) => Puzzle | null = (
  day: string | null
) => {
  const [todayPuzzle, setTodayPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    let puzzleDay = day;
    if (!puzzleDay) {
      puzzleDay = getCurrentLocalDateAsString();
    }
    const dailyPuzzle: PuzzleInput = puzzles[puzzleDay];

    if (dailyPuzzle) {
      // Set puzzle # to the # of days from 2024-02-25 to the puzzleDay
      const puzzleNumber = getPuzzleNumber(puzzleDay);

      if (dailyPuzzle.options) {
        const correctOptions: RankedAnswer[] = dailyPuzzle.answers.map(
          (answer, index) => ({
            ...answer,
            rank: index + 1,
          })
        );
        const incorrectOptions: RankedAnswer[] = dailyPuzzle.options!!.map(
          (option, index) => ({
            ...option,
            rank: index + 6, // Exclude the top 5 correct options and add 1 for 0-indexing
          })
        );

        // Aggregate correct and incorrect options into one list
        const allOptions: RankedAnswer[] = [
          ...correctOptions,
          ...incorrectOptions,
        ];

        setTodayPuzzle({
          ...dailyPuzzle,
          num: puzzleNumber,
          options: undefined,
          optionsRanked: allOptions,
        });
      } else {
        const optionsList: string[] = options[dailyPuzzle.optionsKey!!];

        setTodayPuzzle({
          ...dailyPuzzle,
          num: puzzleNumber,
          options: optionsList,
        });
      }
    } else {
      // Handle the case where there is no puzzle for today
      setTodayPuzzle(null);
    }
  }, [day]);

  return todayPuzzle;
};

export default useDailyPuzzle;
