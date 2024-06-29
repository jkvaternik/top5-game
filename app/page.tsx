"use client"

import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import InputComponent from "./components/InputComponent";
import useDailyPuzzle from "./hooks/useDailyPuzzle";
import { getCurrentLocalDateAsString, getScore, isNewVisitor } from "./utils";

import GameOverModal from "./components/GameOverModal";

import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import RankList from "./components/RankList";
import { InstructionsModal } from "./components/InstructionsModal";

import { useGameState } from "./hooks/useGameState";
import ArchiveModal from "./components/ArchiveModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "./views/Header";
import GameView from "./views/GameView";




export default function Home() {
  const router = useRouter()
  const pathname = usePathname()

  // const searchParams = useSearchParams()
  // const date = searchParams.get('date')
  
  const puzzle = useDailyPuzzle(null);
  const { guesses, setGuesses, handleGuess, lives, gameOver } = useGameState(puzzle, null);

  const [showGameOverModal, setShowGameOverModal] = useState(true);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  useEffect(() => {
    if (isNewVisitor()) {
      setShowInstructionsModal(true);
    }

    localStorage.setItem('lastVisit', JSON.stringify(new Date().toLocaleString()));
  }, []);

  const resetGame = (date: string) => {
    const gameAtDate = localStorage.getItem(date)
    if (gameAtDate == null) {
      setGuesses([])
    } else {
      setGuesses(JSON.parse(gameAtDate))
    }
  }

  return (
    <main style={{ margin: '4vh auto' }} className="w-10/12 sm:w-8/12 md:w-1/2">
      <ToastContainer closeButton={false} />
      <GameView puzzle={puzzle} guesses={guesses} handleGuess={handleGuess} lives={lives} gameOver={gameOver} setShowInstructionsModal={setShowInstructionsModal} setShowGameOverModal={setShowGameOverModal} />
      <InstructionsModal isOpen={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} />
      <ArchiveModal isOpen={showArchiveModal} onClose={() => setShowArchiveModal(false)} resetGame={resetGame}/>
      {gameOver && <GameOverModal puzzle={puzzle!!} isOpen={showGameOverModal} score={getScore(guesses, puzzle!!.answers)} onClose={() => setShowGameOverModal(false)} />}
    </main >
  );
}
