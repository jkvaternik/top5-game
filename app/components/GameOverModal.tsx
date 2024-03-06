import { useEffect, useState } from "react";
import { Puzzle } from "../hooks/useDailyPuzzle";
import { getScoreMessage, getShareableEmojiScore } from "../utils";
import { toast, Bounce } from 'react-toastify';
import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Montserrat } from "next/font/google";

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

const DELAY_MS = 800;

const GameOverModal = ({ puzzle, score, isOpen, onClose }: Props) => {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowComponent(true);
    }, DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, []);

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

  if (!isOpen) return null;
  return (
    showComponent &&
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-center'>
      <div className={`bg-white rounded-lg ${showComponent ? 'animate-fade' : ''}`}>
        <XMarkIcon className="h-6 w-6 ml-auto mr-6 mt-6 text-dark-maroon" onClick={() => onClose()} />
        <div className="p-12 pt-9">
          <h2 className={`text-2xl mb-8 font-bold text-dark-maroon ${montserrat.className}`}>{getScoreMessage(score)}</h2>
          <p className="mb-2 font-semibold text-dark-maroon">Top 5 (#{puzzle.num})</p>
          <p className="mb-12 text-3xl">{getShareableEmojiScore(score)}</p>
          <button className="py-2 px-4 text-white font-medium rounded hover:bg-blue-700 w-full" style={{ backgroundColor: '#946969' }} onClick={copyScore}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}


export default GameOverModal;