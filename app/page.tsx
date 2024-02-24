"use client"

import { useState } from "react";
import ResultCard from "./components/ResultCard";
import useDailyPuzzle from "./hooks/useDailyPuzzle";

/* TODO 
- implement game over overlay/sharing
- add helper text for user
- add more questions
- add hints? could either let users guess w/ lives, grey if wrong or 
  let them guess the top 5, allow hints, show board after completion, grey if used hint 
*/

export default function Home() {
  const puzzle = useDailyPuzzle();

  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [isGameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (!isGameOver) {
      setGuesses([...guesses, guess]);
      setGuess('');
      if (guesses.length >= 4) {
        setGameOver(true);
      }
    }
  }

  if (!puzzle) {
    return <div>Loading puzzle...</div>;
  }

  const resultView = guesses.map((guess, index) => (<ResultCard key={index} index={index} guess={guess} list={puzzle.answers} />)).reverse();

  return (
    <main style={{ margin: '5vh auto', width: '75%', height: '100vh' }}>
      <section className="flex flex-row gap-4 items-end">
        <div className="flex flex-col items-center" >
          <h1>top</h1>
          <h1 className="text-5xl">5</h1>
        </div>
        <p>{puzzle.category}</p>
      </section>
      <section>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg p-2 w-full mt-4"
          value={guess}
          placeholder="Enter your guess here..."
          disabled={isGameOver}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key == 'Enter' ? handleGuess() : null}
        />
      </section>
      <br></br>
      <section className="flex flex-col gap-4">
        {resultView}
      </section>
    </main>
  );
}
