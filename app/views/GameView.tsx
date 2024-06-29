import React, { useState } from 'react';

import Header from './Header';
import InputComponent from '../components/InputComponent';
import RankList from '../components/RankList/RankList';

import useDailyPuzzle from '../hooks/useDailyPuzzle';
import GameOverModal from '../components/ModalComponent/Modals/GameOverModal';
import { getScore } from '../utils';
import { useGameState } from '../hooks/useGameState';

interface GameViewProps {
  setShowInstructionsModal: (value: boolean) => void;
}

export default function GameView( { setShowInstructionsModal }: GameViewProps ) {
  const [showGameOverModal, setShowGameOverModal] = useState(true);

  const puzzle = useDailyPuzzle(null);
  const { guesses, setGuesses, handleGuess, lives, gameOver } = useGameState(puzzle, null);

  return (
    <>
      <Header
        puzzle={puzzle}
        lives={lives}
        gameOver={gameOver}
        setShowInstructionsModal={setShowInstructionsModal}
        setShowGameOverModal={setShowGameOverModal}
      />
      {puzzle && <>
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
    </>
  )
};