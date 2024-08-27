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
      if (!dailyPuzzle.optionsKey) {
        const incorrectOptions: RankedAnswer[] = dailyPuzzle.options!!.map((option, index) => ({
          ...option,
          rank: index + 1
        }))
        const sortedOptions = sortOptionsByText(incorrectOptions)
        setTodayPuzzle({ ...dailyPuzzle, options: sortedOptions })
      } else {
        const optionsList: string[] = options[dailyPuzzle.optionsKey]

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
