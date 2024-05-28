import { Puzzle, puzzles } from "../hooks/useDailyPuzzle";
import { getScoreMessage, getShareableEmojiScore } from "../utils";
import { toast, Bounce } from 'react-toastify';
import React from "react";
import { Montserrat } from "next/font/google";
import { ModalComponent } from "./ModalComponent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

const ArchiveModal = ({ isOpen, onClose }: Props) => {
  // const puzzlesView = Object.values(puzzles).map((puzzle, index) => {
  //   return (
  //     <div key={index} className="flex justify-between items-center py-2">
  //       <p className="text-lg">{puzzle.num}</p>
  //     </div>
  //   );
  // }).reverse();
  const puzzlesView = (
    <div className="grid grid-cols-4 gap-4">
      {Object.values(puzzles).map((puzzle, index) => (
        <div key={index} className="flex justify-center items-center bg-gray-200 rounded">
          <span className="text-lg p-4 text-dark-maroon flex items-center justify-center">#{puzzle.num}</span>
        </div>
      ))}
    </div>
  )

  return (
    <ModalComponent delayMs={50} show={isOpen} onClose={onClose} showChildren={isOpen}>
      <div className="p-8 pt-6">
        <h2 className={`text-2xl mb-8 font-bold text-dark-maroon ${montserrat.className}`}>Top 5 Archive</h2>
        <div className="h-80 overflow-scroll">
          {puzzlesView}
        </div>
      </div>
    </ModalComponent>
  );
}


export default ArchiveModal;