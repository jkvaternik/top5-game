import { Answer, Puzzle } from "./hooks/useDailyPuzzle";

// 0 is incorrect, any other number is the rank guessed correctly
export const getScore = (guessHistory: string[], answers: Answer[]) => {
  return guessHistory.map((guess: string) => {
    const rank = answers.map(a => a.text).findIndex(options => options.includes(guess));
    return rank === -1 ? 0 : rank + 1;
  })
}

export const getShareableEmojiScore = (score: number[]) => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const emojiScore = score.map((rank: number) => {
    if (rank === 0) {
      return isDarkMode ? '⬛️' : '⬜';
    }
    return ['🟥', '🟧', '🟨', '🟩', '🟦'][rank - 1];
  }).join('');

  return emojiScore
}

// Game must be over when this is called
export const getScoreMessage = (score: number[]) => {
  const correctGuesses = score.filter(s => s !== 0).length;
  const incorrectGuesses = score.length - correctGuesses;
  if (incorrectGuesses === 0) {
    // Check if all guesses were guessed in order
    if (score.every((s, i) => s === i + 1)) {
      return 'Mastermind!';
    }

    return 'Perfect!';
  }
  if (correctGuesses === 0) {
    return 'You\'ll get it next time!';
  }
  switch (correctGuesses) {
    case 1:
      return 'Oof, tough one!';
    case 2:
      return 'Way to go!';
    case 3:
      return 'Nice one!';
    case 4:
      return 'Good job!';
    case 5:
      return 'Amazing!';
  }
}

export const getLocalStorageOrDefault = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem(key) == null) {
      // reset for new day, we can update this if we want to store any stats
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    else {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      else {
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const getLocalDateAsString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Pad the month and day with a leading zero if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

export const getCurrentLocalDateAsString = () => {
  const now = new Date();
  return getLocalDateAsString(now);
}

export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Create a date with local timezone context explicitly set
  return new Date(year, month - 1, day);
}

export const getDayAfter = (date: string): string => {
  const dateObj = parseLocalDate(date);
  dateObj.setDate(dateObj.getDate() + 1);
  return getLocalDateAsString(dateObj);
}

export const getDayBefore = (date: string): string => {
  const dateObj = parseLocalDate(date);
  dateObj.setDate(dateObj.getDate() - 1);
  return getLocalDateAsString(dateObj);
}

export const setLocalStorageAndState = (key: string, newValue: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
  setter(newValue);
  localStorage.setItem(key, JSON.stringify(newValue));
}

export const isNewVisitor = () => {
  if (typeof window !== 'undefined') {
    const lastVisitDate = localStorage.getItem('lastVisit');
    if (lastVisitDate === null) {
      return true;
    }
    return false;
  }
}

export const isCorrect = (guess: string, puzzle: Puzzle | null) => puzzle ? puzzle.answers.flatMap(a => a.text).includes(guess) : false
