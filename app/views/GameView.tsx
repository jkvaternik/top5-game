'use client'

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Header from './Header';
import InputComponent from '../components/InputComponent';
import RankList from '../components/RankList/RankList';

import useDailyPuzzle from '../hooks/useDailyPuzzle';
import { getCurrentLocalDateAsString, getScore } from '../utils';
import { useGameState } from '../hooks/useGameState';
import ArchiveModal from '../components/ModalComponent/Modals/ArchiveModal';
import GameOverModal from '../components/ModalComponent/Modals/GameOverModal';
import Menu from '../components/Menu/Menu';
import ArchiveHeader from '../components/ArchiveHeader';

interface GameViewProps {
  setShowInstructionsModal: (value: boolean) => void;
}

export default function GameView({ setShowInstructionsModal }: GameViewProps) {
  const [showGameOverModal, setShowGameOverModal] = useState(true);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  let archiveDate = searchParams.get('date')

  const setPuzzleUrl = (date: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', date)
    router.push(pathname + '?' + params.toString())
    resetGame(date)
  }

  if (archiveDate && Date.parse(archiveDate) > Date.now() || getCurrentLocalDateAsString() === archiveDate) {
    router.push(pathname)
    archiveDate = null
  }

  const isArchiveMode = !!archiveDate
  const puzzle = useDailyPuzzle(archiveDate);
  const { guesses, setGuesses, handleGuess, lives, gameOver } = useGameState(puzzle, archiveDate);

  const resetGame = (date: string) => {
    if (typeof window === 'undefined') return
    const gameAtDate = localStorage.getItem(date)
    if (gameAtDate == null) {
      setGuesses([])
      setShowGameOverModal(true)
    } else {
      setGuesses(JSON.parse(gameAtDate))
      setShowGameOverModal(true)
    }
  }

  return (
    <>
      {(isArchiveMode && !!puzzle) &&
        <ArchiveHeader puzzle={puzzle} date={archiveDate!!} changePuzzle={setPuzzleUrl} />
      }
      <Header
        puzzle={puzzle}
        lives={lives}
        gameOver={gameOver}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setShowGameOverModal={setShowGameOverModal}
      />
      <Menu showMenu={showMenu} setShowInstructionsModal={setShowInstructionsModal} setShowArchiveModal={setShowArchiveModal} />
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
      {gameOver && puzzle && <GameOverModal puzzle={puzzle} isOpen={showGameOverModal} score={getScore(guesses, puzzle.answers)} onClose={() => setShowGameOverModal(false)} />}
      <ArchiveModal isOpen={showArchiveModal} onClose={() => {
        setShowArchiveModal(false)
        setShowMenu(false)
      }} resetGame={resetGame} />
    </>
  )
};