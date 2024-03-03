"use client"

import { useEffect, useMemo, useState } from "react";
import { ToastContainer } from 'react-toastify';
import InputComponent from "./components/InputComponent";
import useDailyPuzzle from "./hooks/useDailyPuzzle";
import { getLocalStorageOrDefault, getScore, isNewDay, setLocalStorageAndState } from "./utils";
import { HeartIcon, ShareIcon } from '@heroicons/react/24/solid'
import GameOverModal from "./components/GameOverModal";

import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import { Montserrat } from "next/font/google";
import RankList from "./components/RankList";

const LIVES = 5

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});


export default function Home() {
  const puzzle = useDailyPuzzle();

  // TODO - move to a custom type -> hook
  const [guessHistory, setGuessHistory] = useState<string[]>(getLocalStorageOrDefault('guessHistory', []));
  const [guesses, setGuesses] = useState<string[]>(getLocalStorageOrDefault('guesses', Array<string>(LIVES).fill('')));
  const [lives, setLives] = useState<number>(getLocalStorageOrDefault('lives', LIVES));
  const gameOver = useMemo(() => guesses && (lives === 0 || guesses.every(g => g !== '')), [lives, guesses]);

  const [isExploding, setIsExploding] = useState(false);
  const [animateChange, setAnimateChange] = useState(false);

  const [showModal, setShowModal] = useState(true);

  // Trigger animations on life loss
  useEffect(() => {
    if (lives < LIVES) {
      setIsExploding(true);
      setTimeout(() => {
        setIsExploding(false);
        setAnimateChange(true);
        setTimeout(() => setAnimateChange(false), 500);
      }, 500);
    }
  }, [lives]);

  if (!puzzle) {
    return null;
  }

  const handleGuess = (guess: string) => {
    localStorage.setItem('lastVisit', JSON.stringify(new Date().toLocaleString()));

    if (guessHistory.includes(guess) || gameOver) {
      return;
    }
    
    const newGuessHistory = [...guessHistory, guess];
    setLocalStorageAndState('guessHistory', newGuessHistory, setGuessHistory);

    const index = puzzle.answers.indexOf(guess);
    if (index === -1) {
      const newlives: number = lives - 1;
      setLocalStorageAndState('lives', newlives, setLives);
    } else {
      const newGuesses = guesses.map((g, i) => i === index ? guess : g);
      setLocalStorageAndState('guesses', newGuesses, setGuesses);
    }
  }

  const gameView = (
    <>
      <section className={`flex flex-row gap-5 items-end w-full text-dark-maroon font-sans ${montserrat.className}`}>
        <div className="flex flex-col items-center" style={{ marginLeft: '8px' }}>
          <h1 className="text-sm">top</h1>
          <h1 className="text-5xl font-semibold">5</h1>
        </div>
        <p className="text-base grow font-medium">{puzzle.category}</p>
        <div className="self-end flex flex-row items-center gap-2">
          {gameOver ?
            <ShareIcon className="h-5 w-5" onClick={() => setShowModal(true)} />
            :
            <>
              <div className="relative">
                {isExploding && <div className="explode absolute inset-0 bg-red-500 rounded-full"></div>}
                <HeartIcon className={`h-5 w-5 ${isExploding ? 'shrink text-red-500' : ''}`} />
              </div><span className={`text-xl ${animateChange ? 'lives-change' : ''}`}>{lives}</span>
            </>
          }
        </div>
      </section>
      <section>
        <InputComponent items={puzzle.options} handleGuess={handleGuess} isGameOver={gameOver} />
      </section>
      <br></br>
      <section className="flex flex-col gap-4">
        <RankList guesses={guesses} answers={puzzle.answers} isGameOver={gameOver} />
      </section>
    </>
  )

  return (
    <main style={{ margin: '4vh auto' }} className="w-10/12 sm:w-8/12 md:w-1/2">
      <ToastContainer closeButton={false} />
      {gameView}
      {gameOver && <GameOverModal puzzle={puzzle} isOpen={showModal} score={getScore(guessHistory, puzzle.answers)} onClose={() => setShowModal(false)} />}
    </main >
  );
}
