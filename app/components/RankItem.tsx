import { Answer } from "../hooks/useDailyPuzzle";
import NumberIcon from "./NumberIcon";

export default function RankItem({ index, answer, className }: {
  index: number,
  answer?: Answer,
  className?: string
}): JSX.Element {
  const isEmpty = answer === undefined;
  const textAnimation = isEmpty ? 'animate-fade' : '';
  return (
    <div key={index} className={`flex flex-row gap-4 items-center text-dark-maroon ${className}`}>
      <NumberIcon number={index} isEmpty={isEmpty} />
      <div>
        <p className={`text-dark-maroon ${textAnimation}`}>{answer?.text.join(', ')}</p>
        <p className={`text-dark-maroon text-opacity-50 ${textAnimation}`}>{answer?.stat}</p>
      </div>
    </div>
  );
}