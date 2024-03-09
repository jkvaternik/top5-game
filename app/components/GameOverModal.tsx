import { Puzzle } from "../hooks/useDailyPuzzle";
import { getScoreMessage, getShareableEmojiScore } from "../utils";
import { toast, Bounce } from 'react-toastify';
import React from "react";
import { Montserrat } from "next/font/google";
import { ModalComponent } from "./ModalComponent";

type Props = {
  isOpen: boolean;
  score: number[];
  puzzle: Puzzle;
  onClose: () => void;
}

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

const GameOverModal = ({ puzzle, score, isOpen, onClose }: Props) => {
  const copyScore = () => {
    navigator.clipboard.writeText(`Top 5 (#${puzzle.num})\n${getShareableEmojiScore(score)}`);

    // Show a toast above the game over modal that is white text on a green background
    // and disapears after 2 seconds
    toast.success('Score copied to clipboard', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  return (
    <ModalComponent show={isOpen} onClose={onClose} showChildren={isOpen}>
      <div className="p-12 pt-9 text-center">
        <h2 className={`text-2xl mb-8 font-bold text-dark-maroon ${montserrat.className}`}>{getScoreMessage(score)}</h2>
        <p className="mb-2 font-semibold text-dark-maroon">Top 5 (#{puzzle.num})</p>
        <p className="mb-12 text-3xl">{getShareableEmojiScore(score)}</p>
        <button className="py-2 px-4 bg-[#946969] text-white font-medium rounded hover:bg-[#ad8b8b] w-full mb-6" onClick={copyScore}>
          Share
        </button>
        {puzzle.url != null ? <a href={puzzle.url} className={`underline text-sm text-maroon hover:text-[#ad8b8b] active:text-[#7d5959]`} target="_blank">Quiz Source</a> : null}
      </div>
    </ModalComponent>
  );
}


export default GameOverModal;