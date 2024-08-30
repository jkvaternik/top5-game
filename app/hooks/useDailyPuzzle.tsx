import { useState, useEffect } from 'react';
import puzzlesData from '../data/puzzlesV2.json';
import optionsData from '../data/options.json';
import { getCurrentLocalDateAsString } from '../utils';

export type Answer = {
  text: string[];
  stat: string | null;
}

export type RankedAnswer = Answer & {
  rank: number
}

type PuzzleInput = {
  num: number;
  category: string;
  answers: Answer[];
  optionsKey?: string;
  options?: Answer[];
  url?: string;
}

export type Puzzle = {
  num: number;
  category: string;
  answers: Answer[];
  optionsKey?: string;
  options: string[] | Answer[];
  url?: string;
}

export const puzzles: { [key: string]: PuzzleInput } = puzzlesData;
const options: { [key: string]: string[] } = optionsData;

function sortOptionsByText(options: RankedAnswer[]): RankedAnswer[] {
  return options.sort((a, b) => a.text[0].localeCompare(b.text[0]));
}

// This hook returns the puzzle for the current day
// If there is no puzzle for today, it returns null
const useDailyPuzzle: (day: string | null) => Puzzle | null = (day: string | null) => {
  const [todayPuzzle, setTodayPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    let puzzleDay = day
    if (!puzzleDay) {
      puzzleDay = getCurrentLocalDateAsString()
    }
    const dailyPuzzle: PuzzleInput = puzzles[puzzleDay]

    if (dailyPuzzle) {
      if (dailyPuzzle.options) {
        const incorrectOptions: RankedAnswer[] = dailyPuzzle.options!!.map((option, index) => ({
          ...option,
          rank: index + 6 // Exclude the top 5 correct options and add 1 for 0-indexing
        }))
        const correctOptions: RankedAnswer[] = dailyPuzzle.answers.map((answer, index) => ({
          ...answer,
          rank: index + 1
        }))
        
        // Aggregate correct and incorrect options into one list
        const allOptions = [...correctOptions, ...incorrectOptions]

        // Ensure options are sorted alphabetically
        const sortedOptions = sortOptionsByText(allOptions)

        setTodayPuzzle({ ...dailyPuzzle, options: sortedOptions })
      } else {
        const optionsList: string[] = options[dailyPuzzle.optionsKey!!]

        setTodayPuzzle({
          ...dailyPuzzle,
          options: optionsList
        });
      }
    } else {
      // Handle the case where there is no puzzle for today
      setTodayPuzzle(null);
    }
  }, [day]);

  return todayPuzzle;
}

export default useDailyPuzzle;
