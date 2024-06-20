import { puzzles } from "../hooks/useDailyPuzzle";
import React from "react";
import { Montserrat } from "next/font/google";
import { ModalComponent } from "./ModalComponent";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resetGame: (date: string) => void;
}

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ["latin"]
});

/* TODO:
   - highlight or select done/completed/in progress games
   - use pagination instead of scrolling (or with)
   - fix useSearchParams next.js build error (remove commented code)
*/ 
const ArchiveModal = ({ isOpen, onClose, resetGame }: Props) => {
  // const router = useRouter()
  // const pathname = usePathname()
  // const searchParams = useSearchParams()

  // const setPuzzleUrl = (date: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('date', date)
 
  //   router.push(pathname + '?' + params.toString())
  //   resetGame(date)
  //   onClose()
  // }

  const isComplete = (key: string) => localStorage.getItem(key) !== null

  const getColor = (key: string) => isComplete(key) ? 'bg-lime-200' : 'bg-gray-200'
  
  const puzzlesView = (
    <div className="grid grid-cols-4 gap-4">
      {Object.keys(puzzles).map((key, index) => (
        <div key={index} className={`flex justify-center items-center ${getColor(key)} rounded`}>
          <span 
            className="text-lg p-4 text-dark-maroon flex items-center justify-center" 
            /*onClick={() => setPuzzleUrl(key)}*/>#{puzzles[key].num}</span>
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