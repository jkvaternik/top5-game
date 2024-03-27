import { useState, useEffect } from 'react';
import puzzlesData from '../data/puzzles.json';
import optionsData from '../data/options.json';

type PuzzleInput = {
  num: number;
  category: string;
  answers: string[];
  optionsKey: string;
  url?: string;
}

export type Puzzle = {
  num: number;
  category: string;
  answers: string[];
  optionsKey: string;
  options: string[];
  url?: string;
}

const puzzles: { [key: string]: PuzzleInput } = puzzlesData;
const options: { [key: string]: string[] } = optionsData;

// This hook returns the puzzle for the current day
// If there is no puzzle for today, it returns null
const useDailyPuzzle: () => Puzzle | null = () => {
  const [todayPuzzle, setTodayPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    const today: string = "2024-04-01" // getCurrentLocalDateAsString()
    const dailyPuzzle: PuzzleInput = puzzles[today]

    if (dailyPuzzle) {
      const optionsList: string[] = options[dailyPuzzle.optionsKey]
      setTodayPuzzle({
        ...dailyPuzzle,
        options: optionsList
      });
    } else {
      // Handle the case where there is no puzzle for today
      setTodayPuzzle(null);
    }
  }, []);

  return todayPuzzle;
}

const getCurrentLocalDateAsString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const day = now.getDate();

  // Pad the month and day with a leading zero if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

export default useDailyPuzzle;
