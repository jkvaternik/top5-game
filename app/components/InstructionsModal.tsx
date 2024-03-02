import { useEffect, useState } from "react";
import { HeartIcon } from '@heroicons/react/24/solid';
import { ModalComponent } from "./ModalComponent"
import RankItem from "./RankItem";

export const InstructionsModal = ({ isOpen, onClose }:
  {
    isOpen: boolean,
    onClose: () => void
  }) => {
  const [isExploding, setIsExploding] = useState(false);
  const [animateChange, setAnimateChange] = useState(false);

  // Trigger animations on life loss
  useEffect(() => {
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setAnimateChange(true);
      setTimeout(() => setAnimateChange(false), 500);
    }, 500);
  }, []);

  return (
    isOpen &&
    <ModalComponent show={isOpen} onClose={onClose}>
      <div className="p-12 pt-9">
        <h1>How to play</h1>
        <p>Guess the Top 5!</p>
        <ul>
          <li>search for the top 5 of today&apos;s list</li>
          <li>guess the top 5 in order without making any mistakes!</li>
        </ul>
        <p>With each puzzle, you have 5 lives:</p>
        <ul>
          <li>if your attempt is correct, the answer will show on the board!</li>
          <li>Ex. Top 5 Largest bodies of water</li>
          <li>
            <RankItem index={0} displayValue="Pacific Ocean" />
          </li>
          <li>if your attempt is incorrect, you will lose a life</li>
          <div className="self-end flex flex-row items-center gap-2">
            <div className="relative">
              {isExploding && <div className="explode absolute inset-0 bg-red-500 rounded-full"></div>}
              <HeartIcon className={`h-5 w-5 ${isExploding ? 'shrink text-red-500' : ''}`} />
            </div>
            <span className={`text-xl ${animateChange ? 'lives-change' : ''}`}>{5}</span>
          </div>
        </ul>
      </div>
    </ModalComponent>
  );
}
