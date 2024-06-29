"use client"

import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import InputComponent from "./components/InputComponent";
import useDailyPuzzle from "./hooks/useDailyPuzzle";
import { getCurrentLocalDateAsString, getScore, isNewVisitor } from "./utils";
import { HeartIcon, ArrowRightStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import GameOverModal from "./components/GameOverModal";

import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import { Montserrat } from "next/font/google";
import RankList from "./components/RankList";
import { InstructionsModal } from "./components/InstructionsModal";

import { LIVES, useGameState } from "./hooks/useGameState";
import ArchiveModal from "./components/ArchiveModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  
  const puzzle = useDailyPuzzle(date);
  const { guesses, setGuesses, handleGuess, lives, gameOver } = useGameState(puzzle, date);

  const [isExploding, setIsExploding] = useState(false);
  const [animateChange, setAnimateChange] = useState(false);

  const [showGameOverModal, setShowGameOverModal] = useState(true);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (isNewVisitor()) {
      setShowInstructionsModal(true);
    }

    localStorage.setItem('lastVisit', JSON.stringify(new Date().toLocaleString()));
  }, []);

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

  const resetGame = (date: string) => {
    const gameAtDate = localStorage.getItem(date)
    if (gameAtDate == null) {
      setGuesses([])
      setShowGameOverModal(true)
    } else {
      setGuesses(JSON.parse(gameAtDate))
      setShowGameOverModal(true)
    }
  }

  const gameView = (
    <>
      <section className={`flex flex-row gap-5 items-end w-full text-dark-maroon`}>
        <div className={`flex flex-col items-center`} style={{ marginLeft: '8px' }} onClick={() => {
          router.push(pathname)
          setGuesses(JSON.parse(localStorage.getItem(getCurrentLocalDateAsString())!!))
        }}>
          <h1 className="text-sm">top</h1>
          <h1 className="text-5xl font-semibold">5</h1>
        </div>
        {<p className={`text-base text-pretty grow font-medium ${montserrat.className}`}>{showMenu ? null : puzzle?.category}</p>}
        <div className="self-end flex flex-col items-end gap-4">
          {showMenu ? 
            <XMarkIcon className="h-6 w-6 text-dark-maroon cursor-pointer" style={{'transition': '0.3s'}} onClick={() => setShowMenu(false)} />
            : 
            <Cog6ToothIcon className={`h-6 w-6 hover:stroke-[#82A0BC] cursor-pointer`} style={{'transition': '0.3s'}} onClick={() => setShowMenu(!showMenu)} /> 
          }
          {gameOver && !showMenu ?
            <ArrowRightStartOnRectangleIcon className="h-6 w-6 hover:fill-[#82A0BC] cursor-pointer" style={{'transition': '0.3s'}} onClick={() => setShowGameOverModal(true)} />
            :
            <div className={`self-end flex flex-row items-center gap-2 font-base text-base ${showMenu ? 'opacity-0' : 'opacity-100'}`}>
              <span className={`text-xl ${animateChange ? 'lives-change' : ''}`}>{lives}</span>
              <div className="relative">
                {isExploding && <div className="explode absolute inset-0 bg-red-500 rounded-full"></div>}
                <HeartIcon className={`h-6 w-6 ${isExploding ? 'shrink text-red-500' : ''}`} />
              </div>
            </div>
          }
        </div>
      </section>
      {showMenu && 
        <section className="flex flex-col gap-5 items-center w-full content-center text-dark-maroon">
          <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4 mt-36" onClick={() => setShowInstructionsModal(true)}>How to Play</button>
          <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-3/4" onClick={() => setShowArchiveModal(true)}>Archive</button>
        </section>
      }
      {puzzle && !showMenu && <>
        <section>
          <InputComponent items={puzzle.options} handleGuess={handleGuess} isGameOver={gameOver} guesses={guesses} answers={puzzle.answers} />
        </section>
        <br></br>
        <section className="flex flex-col gap-4">
          <RankList guesses={guesses} answers={puzzle.answers} isGameOver={gameOver} />
        </section>
      </>
      }
    </>
  )

  return (
    <main style={{ margin: '4vh auto' }} className="w-10/12 sm:w-8/12 md:w-1/2">
      <ToastContainer closeButton={false} />
      {gameView}
      {showInstructionsModal && <InstructionsModal isOpen={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} />}
      {showArchiveModal && <ArchiveModal isOpen={showArchiveModal} onClose={() => {
        setShowArchiveModal(false)
        setShowMenu(false)
      }} resetGame={resetGame}/>}
      {gameOver && puzzle && <GameOverModal puzzle={puzzle} isOpen={showGameOverModal} score={getScore(guesses, puzzle.answers)} onClose={() => setShowGameOverModal(false)} />}
    </main >
  );
}
