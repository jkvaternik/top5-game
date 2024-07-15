import React, { useEffect, useState } from 'react';

import { HeartIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Montserrat } from "next/font/google";

import { LIVES } from "../hooks/useGameState";
import { Puzzle } from '../hooks/useDailyPuzzle';

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

interface HeaderProps {
  puzzle: Puzzle | null;
  lives: number;
  gameOver: boolean;
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
  setShowGameOverModal: (value: boolean) => void;
}

export default function Header({ puzzle, lives, gameOver, showMenu, setShowMenu, setShowGameOverModal }: HeaderProps) {
  const [isExploding, setIsExploding] = useState(false);
  const [animateChange, setAnimateChange] = useState(false);

  // Trigger animations on life loss
  useEffect(() => {
    if (lives < LIVES) {
      setIsExploding(true);
      setTimeout(() => {
        setIsExploding(false);
        setAnimateChange(true);
        setTimeout(() => setAnimateChange(false), 500);
      }, 500);
    }
  }, [lives]);


  return (
    <>
      <section className={`flex flex-row gap-5 items-end w-full text-dark-maroon`}>
        <div className={`flex flex-col items-center`} style={{ marginLeft: '8px' }}>
          <h1 className="text-sm">top</h1>
          <h1 className="text-5xl font-semibold">5</h1>
        </div>
        {puzzle && <>
          <p className={`text-base text-pretty grow font-medium ${montserrat.className}`}>{showMenu ? null : puzzle?.category}</p>
          <div className="self-end flex flex-col items-end gap-4">
            {showMenu ?
              <XMarkIcon className="h-6 w-6 text-dark-maroon cursor-pointer" style={{ 'transition': '0.3s' }} onClick={() => setShowMenu(false)} />
              :
              <Cog6ToothIcon className={`h-6 w-6 hover:stroke-[#82A0BC] cursor-pointer`} style={{ 'transition': '0.3s' }} onClick={() => setShowMenu(!showMenu)} />
            }
            {!showMenu && gameOver ?
              <ShareIcon className="h-6 w-6 hover:fill-[#82A0BC] cursor-pointer" style={{ 'transition': '0.3s' }} onClick={() => setShowGameOverModal(true)} />
              :
              <div className={`self-end flex flex-row items-center gap-2 font-base text-base ${showMenu ? 'opacity-0' : 'opacity-100'}`}>
                <span className={`text-xl ${animateChange ? 'lives-change' : ''}`}>{lives}</span>
                <div className="relative">
                  {isExploding && <div className="explode absolute inset-0 bg-red-500 rounded-full"></div>}
                  <HeartIcon className={`h-6 w-6 ${isExploding ? 'shrink text-red-500' : ''}`} />
                </div>
              </div>
            }
          </div>
        </>
        }
      </section>
    </>
  )
}