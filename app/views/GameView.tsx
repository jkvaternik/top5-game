import React from 'react';

import Header from './Header';
import InputComponent from '../components/InputComponent';
import RankList from '../components/RankList';

import { Puzzle } from '../hooks/useDailyPuzzle';

interface GameViewProps {
  puzzle: Puzzle | null;
  lives: number;
  guesses: string[];
  handleGuess: (guess: string) => boolean | undefined;
  gameOver: boolean;
  setShowInstructionsModal: (value: boolean) => void;
  setShowGameOverModal: (value: boolean) => void;
}

export default function GameView( { puzzle, guesses, handleGuess, lives, gameOver, setShowInstructionsModal, setShowGameOverModal }: GameViewProps ) {

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
    </>
  )
};