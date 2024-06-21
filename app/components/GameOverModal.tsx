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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      navigator.share(
        {
          title: `Top 5 #${puzzle.num}`,
          text: `Top 5 #${puzzle.num}\n${getShareableEmojiScore(score)}`,
          url: window.location.href
        }
      ).then(() => { console.log('Successful share') }).catch((error) => { 
        console.log('Error sharing', error) 

        navigator.clipboard.writeText(`Top 5 #${puzzle.num}\n${getShareableEmojiScore(score)}`)
      });
    } else {
      navigator.clipboard.writeText(`Top 5 #${puzzle.num}\n${getShareableEmojiScore(score)}`);

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
  }

  return (
    <ModalComponent delayMs={750} show={isOpen} onClose={onClose} showChildren={isOpen}>
      <div className="p-12 pt-9 text-center">
        <h2 className={`text-2xl mb-8 font-bold text-dark-maroon ${montserrat.className}`}>{getScoreMessage(score)}</h2>
        <p className="mb-2 font-semibold text-dark-maroon">Top 5 #{puzzle.num}</p>
        <p className="mb-12 text-3xl">{getShareableEmojiScore(score)}</p>
        <button className="py-2 px-4 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] w-full mb-6" onClick={copyScore} style={{'transition': '0.3s'}}>
          Share
        </button>
        {puzzle.url != null ? <a href={puzzle.url} className={`underline text-sm text-[#304d6d] hover:text-[#82A0BC] active:text-[#38405F]`} target="_blank">Quiz Source</a> : null}
      </div>
    </ModalComponent>
  );
}


export default GameOverModal;