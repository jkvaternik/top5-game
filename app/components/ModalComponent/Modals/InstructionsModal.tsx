import { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { ModalComponent } from "../ModalComponent";
import { RankItem } from "../../RankList/RankItem/RankItem";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const InstructionsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [lives, setLives] = useState(5);
  const [isCorrectOrGameOver, setNumberState] = useState<boolean>(false);
  const [isExploding, setIsExploding] = useState(false);
  const [animateChange, setAnimateChange] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setNumberState(true);
    }, 4000);
    setTimeout(() => {
      setLives(4);
    }, 5000);
  }, []);

  // Trigger animations on life loss
  useEffect(() => {
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setAnimateChange(true);
      setTimeout(() => setAnimateChange(false), 500);
    }, 500);
  }, [lives]);

  return (
    <ModalComponent
      delayMs={500}
      show={isOpen}
      onClose={onClose}
      showChildren={isOpen}
    >
      <div className="p-10 pt-0">
        <h2 className={`text-2xl mb-4 font-bold ${montserrat.className}`}>
          How to play
        </h2>
        <p className="text-l mb-2">Guess the Top 5 of a given category.</p>
        <p className="text-l mb-2">
          With each puzzle, you have a list of options to pick from and 5 lives:
        </p>
        <ul className="list-disc list-outside ml-5 mb-4 ">
          <li className="mb-2">
            If your guess is correct, the answer will show on the board
          </li>
          <div className="mb-4">
            <p className="text-l mb-2 font-semibold">Example</p>
            <RankItem
              index={0}
              answer={{ text: ["Pacific Ocean"], stat: "63.8 million mi²" }}
              isCorrectOrGameOver={isCorrectOrGameOver}
            />
          </div>
          <li className="mb-2">
            If your guess is incorrect, you will lose a life{" "}
          </li>
          <div className="self-end flex flex-row items-center gap-2">
            <div className="relative">
              {isExploding && (
                <div className="explode absolute inset-0 bg-red-500 rounded-full"></div>
              )}
              <HeartIcon
                className={`h-5 w-5 ${isExploding ? "shrink text-red-500" : ""}`}
              />
            </div>
            <span className={`text-l ${animateChange ? "lives-change" : ""}`}>
              {lives}
            </span>
          </div>
        </ul>
        <p className="text-l mb-2">
          Want an extra challenge? Try to guess the top five items in order!
        </p>
        <p className="text-l">
          {" "}
          A new list is available every day at midnight. Good luck!
        </p>
      </div>
    </ModalComponent>
  );
};
