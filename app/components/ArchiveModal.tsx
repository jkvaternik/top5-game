import { puzzles } from "../hooks/useDailyPuzzle";
import React from "react";
import { Montserrat } from "next/font/google";
import { ModalComponent } from "./ModalComponent";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Picker from "./Picker/Picker";

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

  const isComplete = (key: string) => isAttempted(key)

  const isAttempted = (key: string) => localStorage.getItem(key) !== null

  return (
    <ModalComponent delayMs={50} show={isOpen} onClose={onClose} showChildren={isOpen}>
      <div className="m-8">
        <h2 className={`text-2xl mb-6 font-bold text-dark-maroon ${montserrat.className}`}>Archive</h2>
        <Picker />
      </div>
    </ModalComponent>
  );
}


export default ArchiveModal;