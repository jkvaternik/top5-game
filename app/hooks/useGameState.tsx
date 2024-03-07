
import { useState, useMemo } from 'react';
import { getLocalStorageOrDefault, setLocalStorageAndState } from '../utils';
import { Puzzle } from './useDailyPuzzle';

export const LIVES = 5;

export function useGameState(puzzle: Puzzle | null) {
  const [guessHistory, setGuessHistory] = useState<string[]>(() => getLocalStorageOrDefault('guessHistory', []));
  const [guesses, setGuesses] = useState<string[]>(() => getLocalStorageOrDefault('guesses', Array<string>(LIVES).fill('')));

  const lives = useMemo(() => {
    const correctGuesses = guesses.filter(g => g !== '').length;
    const incorrectGuesses = guessHistory.length - correctGuesses;
    return LIVES - incorrectGuesses;
  }, [guesses, guessHistory]);

  const gameOver = useMemo(() => lives === 0 || guesses.every(g => g != ''), [lives, guesses]);

  const handleGuess = (guess: string) => {
    localStorage.setItem('lastVisit', JSON.stringify(new Date().toLocaleString()));

    if (guessHistory.includes(guess) || gameOver) {
      return;
    }

    const newGuessHistory = [...guessHistory, guess];
    setLocalStorageAndState('guessHistory', newGuessHistory, setGuessHistory);

    const index = puzzle!!.answers.indexOf(guess);
    if (index !== -1) {
      const newGuesses = guesses.map((g, i) => i === index ? guess : g);
      setLocalStorageAndState('guesses', newGuesses, setGuesses);
    }
  }

  return { guessHistory, setGuessHistory, guesses, setGuesses, lives, gameOver, handleGuess };
}