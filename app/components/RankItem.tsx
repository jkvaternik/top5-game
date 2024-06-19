import { Answer } from "../hooks/useDailyPuzzle";
import { NumberIcon, StringIcon } from "./Icon";

export function RankItem({ index, answer, isCorrectOrGameOver, className }: {
  index: number,
  answer: Answer,
  isCorrectOrGameOver: boolean,
  className?: string
}): JSX.Element {
  const textAnimation = !isCorrectOrGameOver ? 'animate-fade' : '';
  return (
    <div key={index} className={`flex flex-row gap-4 items-center font-base text-dark-maroon ${className}`}>
      <NumberIcon number={index} isEmpty={!isCorrectOrGameOver} />
      <div>
        <p className={`text-dark-maroon ${textAnimation} `}>{isCorrectOrGameOver && answer.text.join(', ')}</p>
        <p className={`text-dark-maroon text-opacity-70 ${textAnimation}`}>{isCorrectOrGameOver && answer.stat}</p>
      </div>
    </div>
  );
}

export function IncorrectRankItem({ key, guess, isCorrectOrGameOver, className }: {
  key: number,
  guess: string,
  isCorrectOrGameOver: boolean,
  className?: string
}): JSX.Element {
  return (
    <div key={key} className={`flex flex-row gap-2 p-2 rounded-md bg-gray-200 items-center text-dark-maroon ${className}`}>
      <StringIcon string={'X'} isEmpty={!isCorrectOrGameOver} />
      <div>
        <p className={`text-gray-700 font-base`}>{guess}</p>
      </div>
    </div>
  );
}