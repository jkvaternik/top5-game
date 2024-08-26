
import { useState, useMemo } from 'react';
import { getCurrentLocalDateAsString, getLocalStorageOrDefault, isCorrect, setLocalStorageAndState } from '../utils';
import { Puzzle } from './useDailyPuzzle';

export const LIVES = 5;

export function useGameState(puzzle: Puzzle | null, date: string | null) {
  const puzzleDate = date ? date : getCurrentLocalDateAsString();
  const [guesses, setGuesses] = useState<string[]>(getLocalStorageOrDefault(puzzleDate, []));

  const correctGuesses = useMemo(() => guesses.filter(guess => isCorrect(guess, puzzle)).length, [puzzle, guesses]);

  const lives = useMemo(() => {
    const incorrectGuesses = guesses.length - correctGuesses;
    return LIVES - incorrectGuesses;
  }, [guesses.length, correctGuesses]);

  const gameOver = useMemo(() => lives === 0 || correctGuesses === 5, [lives, correctGuesses]);

  // Returns true if the guess is correct, false if incorrect
  const handleGuess = (guess: string) => {
    if (guesses.includes(guess) || gameOver) {
      return;
    }

    const index = puzzle!!.answers.findIndex(answer => answer.text.includes(guess));
    const isCorrect = index !== -1;

    const newGuesses = [...guesses, guess]
    setLocalStorageAndState(puzzleDate, newGuesses, setGuesses);

    if (puzzleDate === getCurrentLocalDateAsString()) {
      if (lives === 1 && !isCorrect) {
        localStorage.setItem('streak', '0');
      }
  
      if (correctGuesses === 4 && isCorrect) {
        let streak = getLocalStorageOrDefault('streak', 0);
        streak += 1;
        localStorage.setItem('streak', streak.toString());
      }  
    }
    
    return isCorrect;
  }

  return { guesses, setGuesses, lives, gameOver, handleGuess, correctGuesses };
}