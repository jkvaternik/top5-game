import React, { useEffect, useState } from 'react';

import { HeartIcon, ShareIcon } from '@heroicons/react/24/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Montserrat } from "next/font/google";

import { LIVES } from "../hooks/useGameState";
import { getCurrentLocalDateAsString } from '../utils';

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

interface HeaderProps {
  puzzle: any;
  lives: number;
  gameOver: boolean;
  setShowInstructionsModal: (value: boolean) => void;
  setShowGameOverModal: (value: boolean) => void;
}

export default function Header({ puzzle, lives, gameOver, setShowInstructionsModal, setShowGameOverModal }: HeaderProps) {
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
    <section className={`flex flex-row gap-5 items-end w-full text-dark-maroon`}>
        <div className={`flex flex-col items-center`} style={{ marginLeft: '8px' }}>
          <h1 className="text-sm">top</h1>
          <h1 className="text-5xl font-semibold">5</h1>
        </div>
        {puzzle && <>
          <p className={`text-base text-pretty grow font-medium ${montserrat.className}`}>{puzzle.category}</p>
          <div className="self-end flex flex-col items-end gap-4">
            <QuestionMarkCircleIcon className="h-6 w-6 hover:stroke-[#82A0BC] cursor-pointer" style={{'transition': '0.3s'}} onClick={() => setShowInstructionsModal(true)} />
            {gameOver ?
              <ShareIcon className="h-6 w-6 hover:fill-[#82A0BC] cursor-pointer" style={{'transition': '0.3s'}} onClick={() => setShowGameOverModal(true)} />
              :
              <div className="self-end flex flex-row items-center gap-2 font-base text-base">
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
  )
}