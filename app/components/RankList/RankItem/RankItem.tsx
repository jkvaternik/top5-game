import { Answer } from "../../../hooks/useDailyPuzzle";
import { NumberIcon, StringIcon } from "./Icon";

export function RankItem({ index, answer, isCorrectOrGameOver, className }: {
  index: number,
  answer: Answer,
  isCorrectOrGameOver: boolean,
  className?: string
}): JSX.Element {
  const textAnimation = !isCorrectOrGameOver ? 'animate-fade' : '';
  return (
    <div key={index} className={`flex flex-row gap-4 items-center font-base text-black-pearl ${className}`}>
      <NumberIcon number={index} isEmpty={!isCorrectOrGameOver} />
      <div>
        <p className={`text-black-pearl dark:text-white ${textAnimation} `}>{isCorrectOrGameOver && answer.text.join(', ')}</p>
        <p className={`text-black-pearl text-opacity-70 dark:text-white ${textAnimation}`}>{isCorrectOrGameOver && answer.stat}</p>
      </div>
    </div>
  );
}

export function IncorrectRankItem({ guess, index, stat, isCorrectOrGameOver, className }: {
  guess: string,
  index: number,
  stat: string,
  isCorrectOrGameOver: boolean,
  className?: string
}): JSX.Element {
  return (
    <div className={`flex flex-nowrap flex-row gap-2 p-2 rounded-md bg-gray-200 items-center text-black-pearl ${className} animated_fadeIn`}>
      <StringIcon string={index === 0 ? 'X' : `${index}`} isEmpty={!isCorrectOrGameOver} />
      <div>
        <p className={`text-gray-700 font-base`}>{guess}</p>
        <p className={`text-gray-700 font-base text-opacity-70`}>{stat}</p>
      </div>
    </div>
  );
}