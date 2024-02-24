"use client"

import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import ResultCard from "./components/ResultCard";
import InputComponent from "./components/InputComponent";
import useDailyPuzzle from "./hooks/useDailyPuzzle";
import { getScore } from "./utils";
import { HeartIcon } from '@heroicons/react/24/solid'
import GameOverModal from "./components/GameOverModal";

import 'react-toastify/dist/ReactToastify.css';

/* TODO 
- implement game over overlay/sharing
- add helper text for user
- add more questions
- add hints? could either let users guess w/ lives, grey if wrong or 
  let them guess the top 5, allow hints, show board after completion, grey if used hint 
*/

export default function Home() {
  const puzzle = useDailyPuzzle();

  const [guesses, setGuesses] = useState<string[]>(Array<string>(5).fill(''));
  const [isGameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState<number>(5);

  const handleGuess = (guess: string) => {
    if (!isGameOver && puzzle) {
      const index = puzzle.answers.indexOf(guess);
      if (index !== -1) { 
        const newGuesses = guesses.map((g, i) => i === index ? guess : g);
        setGuesses(newGuesses);
      } else {
        setLives(lives - 1);
      }
      if (guesses.every((guess) => guess !== '' || lives === 0)) {
        setGameOver(true);
      }
    }
  }

  if (!puzzle) {
    return <div>Loading puzzle...</div>;
  }

  const resultView = guesses.map((guess, index) => (<ResultCard key={index} index={index} guess={guess} list={puzzle.answers}/>));

  const gameView = (
    <>
      <section className="flex flex-row gap-4 items-end w-full">
        <div className="flex flex-col items-center" >
          <h1>top</h1>
          <h1 className="text-5xl">5</h1>
        </div>
        <p className="grow">{puzzle.category}</p>
        <div className="self-end flex flex-row items-center gap-3">
            <HeartIcon className="h-5 w-5"/>
            <span>{lives}</span>
        </div>
      </section>
      <section>
        <InputComponent items={puzzle.options} handleGuess={handleGuess} isGameOver={isGameOver} />
      </section>
      <br></br>
      <section className="flex flex-col gap-4">
        {resultView}
      </section>
    </>
  )

  return (
    <main style={{ margin: '5vh auto', width: '75%', height: '100vh' }}>
      <ToastContainer closeButton={false} />
      {gameView}
      {<GameOverModal isOpen={isGameOver} score={getScore(guesses, puzzle.answers)} />}
    </main >
  );
}
