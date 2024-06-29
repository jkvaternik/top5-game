import React, { useState } from 'react';

import Header from './Header';
import InputComponent from '../components/InputComponent';
import RankList from '../components/RankList/RankList';

import useDailyPuzzle from '../hooks/useDailyPuzzle';
import GameOverModal from '../components/ModalComponent/Modals/GameOverModal';
import { getScore } from '../utils';
import { useGameState } from '../hooks/useGameState';
import ArchiveModal from '../components/ModalComponent/Modals/ArchiveModal';

interface GameViewProps {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
  setShowInstructionsModal: (value: boolean) => void;
}

export default function GameView( { showMenu, setShowMenu, setShowInstructionsModal }: GameViewProps ) {
  const [showGameOverModal, setShowGameOverModal] = useState(true);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const puzzle = useDailyPuzzle(null);
  const { guesses, setGuesses, handleGuess, lives, gameOver } = useGameState(puzzle, null);

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

  return (
    <>
      <Header
        puzzle={puzzle}
        lives={lives}
        gameOver={gameOver}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setShowInstructionsModal={setShowInstructionsModal}
        setShowGameOverModal={setShowGameOverModal}
      />
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
      {gameOver && <GameOverModal puzzle={puzzle!!} isOpen={showGameOverModal} score={getScore(guesses, puzzle!!.answers)} onClose={() => setShowGameOverModal(false)} />}
      <ArchiveModal isOpen={showArchiveModal} onClose={() => {
        setShowArchiveModal(false)
        setShowMenu(false)
      }} resetGame={resetGame} />
    </>
  )
};