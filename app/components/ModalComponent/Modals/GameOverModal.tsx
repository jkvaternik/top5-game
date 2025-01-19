
import { toast, Bounce, ToastContainer } from 'react-toastify';
import React from "react";
import { Montserrat } from "next/font/google";
import { ModalComponent } from "../ModalComponent";
import { Puzzle } from '@/app/hooks/useDailyPuzzle';
import { getShareableEmojiScore, getScoreMessage, getLocalStorageOrDefault } from '@/app/utils';
import { ShareIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from '../../Button';

type Props = {
  isOpen: boolean;
  isArchiveMode: boolean;
  score: number[];
  puzzle: Puzzle;
  onClose: () => void;
}

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

const SuggestionLink = () => (
  <>
    <p className="text-sm">
      Have an idea for a Top 5 puzzle?
    </p>
    <p className="text-sm">
      Submit it <a href="https://forms.gle/WgG9wnRADQxwZjEE9" target="_blank" className="underline">here</a>.
    </p>
  </>
);

const GameOverModal = ({ puzzle, score, isOpen, onClose, isArchiveMode }: Props) => {
  const streak = getLocalStorageOrDefault('streak', 0);
  const createShareMessage = (includeUrl: boolean) => {
    const message = {
      title: `Top 5 #${puzzle.num}`,
      text: `Top 5 #${puzzle.num}\n${getShareableEmojiScore(score)}`
    }
    return includeUrl ? { ...message, url: window.location.href } : message;
  }
  
  const getUrlSetting = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('includeUrl') === 'true' || localStorage.getItem('includeUrl') === null;
    } else {
      // Default to true if not in browser
      return true
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
        <div className="flex flex-col p-12 pt-3 text-center justify-center">
          <h2 className={`text-2xl mb-8 font-bold ${montserrat.className}`}>{getScoreMessage(score)}</h2>
          <p className="mb-2 left-align font-semibold">Top 5 #{puzzle.num}</p>
          <p className="mb-4 text-3xl">{getShareableEmojiScore(score)}</p>
          <Button onClick={copyScore}>
            Share <ShareIcon className="h-6 w-6" style={{ display: 'inline-block' }} />
          </Button>
          {!!isArchiveMode && <Button onClick={() => window.location.href = '/'} buttonType="secondary">
            Play Today&apos;s Quiz!
          </Button>}
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-500 dark:border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">Statistics</span>
            <div className="flex-grow border-t border-gray-500 dark:border-gray-400"></div>
          </div>
          <div className='w-full flex justify-between mb-2'>
            <p className="mb-2">Streak</p>
            <p className="mb-2">{streak === 0 ? `${streak}` : `${streak} 🔥`}</p>
          </div>
          {puzzle.url != null ? <a href={puzzle.url} className={`underline text-sm mb-4 text-[#304d6d] dark:text-white hover:text-[#82A0BC] active:text-[#38405F]`} target="_blank">Quiz Source</a> : null}
          <SuggestionLink />
        </div>
      </ModalComponent>
    </>
  );
}


export default GameOverModal;