
import { toast, Bounce, ToastContainer } from 'react-toastify';
import React from "react";
import { Montserrat } from "next/font/google";
import { ModalComponent } from "../ModalComponent";
import { Puzzle } from '@/app/hooks/useDailyPuzzle';
import { getShareableEmojiScore, getScoreMessage } from '@/app/utils';
import { ShareIcon } from "@heroicons/react/24/outline";

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

  const createShareMessage = (includeUrl: boolean) => {
    const message = {
      title: `Top 5 #${puzzle.num}`,
      text: `Top 5 #${puzzle.num}\n${getShareableEmojiScore(score)}`
    }
    return includeUrl ? { ...message, url: window.location.href } : message;
  }
  
  const getUrlSetting = () => {
    if (typeof window !== 'undefined') {
      console.log(localStorage.getItem('includeUrl'))
      return localStorage.getItem('includeUrl') === 'true' || localStorage.getItem('includeUrl') === null;
    } else {
      return false
    }
  }

  const copyScore = () => {
    const includeUrl: boolean = getUrlSetting();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const shareableText = `Top 5 #${puzzle.num}\n${getShareableEmojiScore(score) + (includeUrl ? `\n${window.location.href}` : '')}`;

    if (isMobile) {
      navigator.share(
        createShareMessage(includeUrl)
      ).then(() => { console.log('Successful share') }).catch((error) => {
        console.log('Error sharing', error)

        navigator.clipboard.writeText(shareableText);
      });
    } else {
      navigator.clipboard.writeText(shareableText);

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
    <>
      <ToastContainer closeButton={false} />
      <ModalComponent delayMs={750} show={isOpen} onClose={onClose} showChildren={isOpen}>
        <div className="flex flex-col p-12 pt-9 text-center items-center justify-center">
          <h2 className={`text-2xl mb-8 font-bold text-dark-maroon ${montserrat.className}`}>{getScoreMessage(score)}</h2>
          <p className="mb-2 font-semibold text-dark-maroon">Top 5 #{puzzle.num}</p>
          <p className="mb-12 text-3xl">{getShareableEmojiScore(score)}</p>
          <button className="py-3 px-12 bg-[#304d6d] text-white font-medium rounded-full hover:bg-[#82A0BC] mb-6" onClick={copyScore} style={{ 'transition': '0.3s' }}>
            <div className="flex flex-row justify-center gap-2">
              Share score <ShareIcon className="h-6 w-6" style={{ display: 'inline-block' }} />
            </div>
          </button>
          {puzzle.url != null ? <a href={puzzle.url} className={`underline text-sm text-[#304d6d] hover:text-[#82A0BC] active:text-[#38405F]`} target="_blank">Quiz Source</a> : null}
        </div>
      </ModalComponent>
    </>
  );
}


export default GameOverModal;