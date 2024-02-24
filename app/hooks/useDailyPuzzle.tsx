import { useState, useEffect } from 'react';
import puzzles from '../data/puzzles.json';

const useDailyPuzzle = () => {
  const [todayPuzzle, setTodayPuzzle] = useState(null);

  useEffect(() => {
    const today = getCurrentLocalDateAsString()
    const dailyPuzzle = puzzles[today];

    if (dailyPuzzle) {
      setTodayPuzzle(dailyPuzzle);
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
