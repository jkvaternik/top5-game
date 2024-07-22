import { useState, useEffect } from 'react';
import { fetchPuzzle } from '../services/services';

export type Answer = {
  text: string[];
  stat: string | null;
}

export type Puzzle = {
  date?: string;
  num: number;
  category: string;
  answers: Answer[];
  optionsKey: string;
  options: string[];
  url?: string;
}

const useDailyPuzzle: (day: string | null) => Puzzle | null = (day: string | null) => {
  const [todayPuzzle, setTodayPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    fetchPuzzle(day, setTodayPuzzle);
  }, [day]);

  return todayPuzzle;
}

export default useDailyPuzzle;